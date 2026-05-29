// packages/memory-host-sdk/src/host batch status helpers and runtime behavior.
const TERMINAL_FAILURE_STATES = new Set(["failed", "expired", "cancelled", "canceled"]);

type BatchStatusLike = {
  id?: string;
  status?: string;
  output_file_id?: string | null;
  error_file_id?: string | null;
};

/** Public type describing Batch Completion Result for packages/memory-host-sdk. */
export type BatchCompletionResult = {
  outputFileId: string;
  errorFileId?: string;
};

/** Public helper for resolve Batch Completion From Status behavior in packages/memory-host-sdk. */
export function resolveBatchCompletionFromStatus(params: {
  provider: string;
  batchId: string;
  status: BatchStatusLike;
}): BatchCompletionResult {
  if (!params.status.output_file_id) {
    throw new Error(`${params.provider} batch ${params.batchId} completed without output file`);
  }
  return {
    outputFileId: params.status.output_file_id,
    errorFileId: params.status.error_file_id ?? undefined,
  };
}

/** Public helper for throw If Batch Terminal Failure behavior in packages/memory-host-sdk. */
export async function throwIfBatchTerminalFailure(params: {
  provider: string;
  status: BatchStatusLike;
  readError: (errorFileId: string) => Promise<string | undefined>;
}): Promise<void> {
  const state = params.status.status ?? "unknown";
  if (!TERMINAL_FAILURE_STATES.has(state)) {
    return;
  }
  const detail = params.status.error_file_id
    ? await params.readError(params.status.error_file_id)
    : undefined;
  const suffix = detail ? `: ${detail}` : "";
  throw new Error(`${params.provider} batch ${params.status.id ?? "<unknown>"} ${state}${suffix}`);
}

/** Public helper for resolve Completed Batch Result behavior in packages/memory-host-sdk. */
export async function resolveCompletedBatchResult(params: {
  provider: string;
  status: BatchStatusLike;
  wait: boolean;
  waitForBatch: () => Promise<BatchCompletionResult>;
}): Promise<BatchCompletionResult> {
  const batchId = params.status.id ?? "<unknown>";
  if (!params.wait && params.status.status !== "completed") {
    throw new Error(
      `${params.provider} batch ${batchId} submitted; enable remote.batch.wait to await completion`,
    );
  }
  const completed =
    params.status.status === "completed"
      ? resolveBatchCompletionFromStatus({
          provider: params.provider,
          batchId,
          status: params.status,
        })
      : await params.waitForBatch();
  if (!completed.outputFileId) {
    throw new Error(`${params.provider} batch ${batchId} completed without output file`);
  }
  return completed;
}
