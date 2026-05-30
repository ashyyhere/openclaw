/** Routes console logs to stderr when commands emit JSON on stdout. */
import { loggingState } from "../logging/state.js";

/** Detects whether argv requests JSON output before command separator. */
export function hasJsonOutputFlag(argv: readonly string[]): boolean {
  for (const arg of argv) {
    if (arg === "--") {
      return false;
    }
    if (arg === "--json" || arg.startsWith("--json=")) {
      return true;
    }
  }
  return false;
}

/** Routes console logs to stderr while a JSON-output command runs. */
export async function withConsoleLogsRoutedToStderrForJson<T>(
  argv: readonly string[],
  run: () => Promise<T>,
): Promise<T> {
  if (!hasJsonOutputFlag(argv)) {
    return run();
  }
  const previousForceStderr = loggingState.forceConsoleToStderr;
  loggingState.forceConsoleToStderr = true;
  try {
    return await run();
  } finally {
    loggingState.forceConsoleToStderr = previousForceStderr;
  }
}
