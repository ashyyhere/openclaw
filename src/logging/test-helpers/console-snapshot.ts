// Test helper for saving and restoring patched console methods.
/** Snapshot of console methods that may be patched by logging tests. */
export type ConsoleSnapshot = {
  log: typeof console.log;
  info: typeof console.info;
  warn: typeof console.warn;
  error: typeof console.error;
  debug: typeof console.debug;
  trace: typeof console.trace;
};

/** Captures the current console methods before a test patches logging. */
export function captureConsoleSnapshot(): ConsoleSnapshot {
  return {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug,
    trace: console.trace,
  };
}

/** Restores console methods from a prior snapshot. */
export function restoreConsoleSnapshot(snapshot: ConsoleSnapshot): void {
  console.log = snapshot.log;
  console.info = snapshot.info;
  console.warn = snapshot.warn;
  console.error = snapshot.error;
  console.debug = snapshot.debug;
  console.trace = snapshot.trace;
}
