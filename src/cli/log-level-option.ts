/** Commander argument parser for allowed CLI log levels. */
import { InvalidArgumentError } from "commander";
import { ALLOWED_LOG_LEVELS, type LogLevel, tryParseLogLevel } from "../logging/levels.js";

/** Reused constant for CLI LOG LEVEL VALUES behavior in src/cli. */
export const CLI_LOG_LEVEL_VALUES = ALLOWED_LOG_LEVELS.join("|");

/** Reused helper for parse Cli Log Level Option behavior in src/cli. */
export function parseCliLogLevelOption(value: string): LogLevel {
  const parsed = tryParseLogLevel(value);
  if (!parsed) {
    throw new InvalidArgumentError(`Invalid --log-level (use ${CLI_LOG_LEVEL_VALUES})`);
  }
  return parsed;
}
