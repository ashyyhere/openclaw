// Global CLI verbosity/yes-mode facade plus themed console helpers.
/** Re-export global process flags used by legacy CLI entrypoints. */
export { isVerbose, isYes, setVerbose, setYes } from "./global-state.js";
import { theme } from "../packages/terminal-core/src/theme.js";
import { isVerbose } from "./global-state.js";
import { getLogger, isFileLogLevelEnabled } from "./logging/logger.js";

/** Checks whether verbose output should go to console or debug file logging. */
export function shouldLogVerbose() {
  return isVerbose() || isFileLogLevelEnabled("debug");
}

/** Writes verbose text to debug logs and, when enabled, to the muted console stream. */
export function logVerbose(message: string) {
  if (!shouldLogVerbose()) {
    return;
  }
  try {
    getLogger().debug({ message }, "verbose");
  } catch {
    // ignore logger failures to avoid breaking verbose printing
  }
  if (!isVerbose()) {
    return;
  }
  console.log(theme.muted(message));
}

/** Writes muted console-only verbose output for callers that already handled file logging. */
export function logVerboseConsole(message: string) {
  if (!isVerbose()) {
    return;
  }
  console.log(theme.muted(message));
}

type ThemeFormatter = (value: string) => string;

/** Theme formatter for success text. */
export const success: ThemeFormatter = theme.success;
/** Theme formatter for warning text. */
export const warn: ThemeFormatter = theme.warn;
/** Theme formatter for informational text. */
export const info: ThemeFormatter = theme.info;
/** Theme formatter for error/danger text. */
export const danger: ThemeFormatter = theme.error;
