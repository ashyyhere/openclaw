// Typed error helpers for failures from the local embedding worker process.
/** Stable error codes for local embedding worker process and IPC failures. */
export const LOCAL_EMBEDDING_WORKER_ERROR_CODES = {
  exited: "LOCAL_EMBEDDING_WORKER_EXITED",
  processError: "LOCAL_EMBEDDING_WORKER_PROCESS_ERROR",
  ipcError: "LOCAL_EMBEDDING_WORKER_IPC_ERROR",
} as const;

/** Error code emitted on LocalEmbeddingWorkerFailureError instances. */
export type LocalEmbeddingWorkerFailureCode =
  (typeof LOCAL_EMBEDDING_WORKER_ERROR_CODES)[keyof typeof LOCAL_EMBEDDING_WORKER_ERROR_CODES];

/** Coarse failure category for local embedding worker failures. */
export type LocalEmbeddingWorkerFailureReason = "exit" | "signal" | "process-error" | "ipc";

/** Error object carrying worker exit/signal details when available. */
export type LocalEmbeddingWorkerFailureError = Error & {
  code: LocalEmbeddingWorkerFailureCode;
  reason: LocalEmbeddingWorkerFailureReason;
  exitCode?: number | null;
  signal?: NodeJS.Signals | null;
};

const LOCAL_EMBEDDING_WORKER_FAILURE_CODES = new Set<string>(
  Object.values(LOCAL_EMBEDDING_WORKER_ERROR_CODES),
);

/** Creates a typed local embedding worker failure error. */
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

/** Type guard for local embedding worker failure errors. */
export function isLocalEmbeddingWorkerFailure(
  err: unknown,
): err is LocalEmbeddingWorkerFailureError {
  return (
    err instanceof Error &&
    LOCAL_EMBEDDING_WORKER_FAILURE_CODES.has(String((err as { code?: unknown }).code))
  );
}
