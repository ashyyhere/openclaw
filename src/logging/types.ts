// Shared types for logging types behavior.
import type { LogLevel } from "./levels.js";

/** Shared type for Console Style in src/logging. */
export type ConsoleStyle = "pretty" | "compact" | "json";

/** Shared type for Logger Settings in src/logging. */
export type LoggerSettings = {
  level?: LogLevel;
  file?: string;
  maxFileBytes?: number;
  consoleLevel?: LogLevel;
  consoleStyle?: ConsoleStyle;
};
