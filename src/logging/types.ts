// Shared logging configuration types used by console and file logger setup.
import type { LogLevel } from "./levels.js";

/** Console renderer modes: human pretty output, compact text, or JSON lines. */
export type ConsoleStyle = "pretty" | "compact" | "json";

/** User/configurable logging settings before runtime defaults are applied. */
export type LoggerSettings = {
  level?: LogLevel;
  file?: string;
  maxFileBytes?: number;
  consoleLevel?: LogLevel;
  consoleStyle?: ConsoleStyle;
};
