// OpenClaw globals helpers and runtime behavior.
/** Re-exported API for src, starting with is Verbose. */
export { isVerbose, isYes, setVerbose, setYes } from "./global-state.js";
import { theme } from "../packages/terminal-core/src/theme.js";
import { isVerbose } from "./global-state.js";
import { getLogger, isFileLogLevelEnabled } from "./logging/logger.js";

/** Reused helper for should Log Verbose behavior in src. */
export function shouldLogVerbose() {
  return isVerbose() || isFileLogLevelEnabled("debug");
}

/** Reused helper for log Verbose behavior in src. */
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

/** Reused helper for log Verbose Console behavior in src. */
export function logVerboseConsole(message: string) {
  if (!isVerbose()) {
    return;
  }
  console.log(theme.muted(message));
}

type ThemeFormatter = (value: string) => string;

/** Reused constant for success behavior in src. */
export const success: ThemeFormatter = theme.success;
/** Reused constant for warn behavior in src. */
export const warn: ThemeFormatter = theme.warn;
/** Reused constant for info behavior in src. */
export const info: ThemeFormatter = theme.info;
/** Reused constant for danger behavior in src. */
export const danger: ThemeFormatter = theme.error;
