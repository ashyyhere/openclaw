// packages/memory-host-sdk/src/host embedding worker errors helpers and runtime behavior.
/** Public constant for LOCAL EMBEDDING WORKER ERROR CODES behavior in packages/memory-host-sdk. */
export const LOCAL_EMBEDDING_WORKER_ERROR_CODES = {
  exited: "LOCAL_EMBEDDING_WORKER_EXITED",
  processError: "LOCAL_EMBEDDING_WORKER_PROCESS_ERROR",
  ipcError: "LOCAL_EMBEDDING_WORKER_IPC_ERROR",
} as const;

/** Public type describing Local Embedding Worker Failure Code for packages/memory-host-sdk. */
export type LocalEmbeddingWorkerFailureCode =
  (typeof LOCAL_EMBEDDING_WORKER_ERROR_CODES)[keyof typeof LOCAL_EMBEDDING_WORKER_ERROR_CODES];

/** Public type describing Local Embedding Worker Failure Reason for packages/memory-host-sdk. */
export type LocalEmbeddingWorkerFailureReason = "exit" | "signal" | "process-error" | "ipc";

/** Public type describing Local Embedding Worker Failure Error for packages/memory-host-sdk. */
export type LocalEmbeddingWorkerFailureError = Error & {
  code: LocalEmbeddingWorkerFailureCode;
  reason: LocalEmbeddingWorkerFailureReason;
  exitCode?: number | null;
  signal?: NodeJS.Signals | null;
};

const LOCAL_EMBEDDING_WORKER_FAILURE_CODES = new Set<string>(
  Object.values(LOCAL_EMBEDDING_WORKER_ERROR_CODES),
);

/** Public helper for create Local Embedding Worker Failure Error behavior in packages/memory-host-sdk. */
export function createLocalEmbeddingWorkerFailureError(params: {
  message: string;
  code: LocalEmbeddingWorkerFailureCode;
  reason: LocalEmbeddingWorkerFailureReason;
  exitCode?: number | null;
  signal?: NodeJS.Signals | null;
  cause?: unknown;
}): LocalEmbeddingWorkerFailureError {
  return Object.assign(new Error(params.message), {
    code: params.code,
    reason: params.reason,
    ...(params.exitCode !== undefined ? { exitCode: params.exitCode } : {}),
    ...(params.signal !== undefined ? { signal: params.signal } : {}),
    ...(params.cause !== undefined ? { cause: params.cause } : {}),
  });
}

/** Public helper for is Local Embedding Worker Failure behavior in packages/memory-host-sdk. */
export function isLocalEmbeddingWorkerFailure(
  err: unknown,
): err is LocalEmbeddingWorkerFailureError {
  return (
    err instanceof Error &&
    LOCAL_EMBEDDING_WORKER_FAILURE_CODES.has(String((err as { code?: unknown }).code))
  );
}
