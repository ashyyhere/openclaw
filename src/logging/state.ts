// Shared mutable logging runtime state: logger caches, console patch flags, and
// test overrides kept in one module to avoid import cycles.
/** Process-local logging state shared by console/file logger modules. */
export const loggingState = {
  cachedLogger: null as unknown,
  cachedSettings: null as unknown,
  cachedConsoleSettings: null as unknown,
  overrideSettings: null as unknown,
  invalidEnvLogLevelValue: null as string | null,
  consolePatched: false,
  forceConsoleToStderr: false,
  consoleTimestampPrefix: false,
  consoleSubsystemFilter: null as string[] | null,
  resolvingConsoleSettings: false,
  streamErrorHandlersInstalled: false,
  rawConsole: null as {
    log: typeof console.log;
    info: typeof console.info;
    warn: typeof console.warn;
    error: typeof console.error;
  } | null,
};
