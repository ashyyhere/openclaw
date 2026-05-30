import { InvalidArgumentError } from "commander";
import { ALLOWED_LOG_LEVELS, type LogLevel, tryParseLogLevel } from "../logging/levels.js";

/** Commander help text fragment listing accepted log levels. */
export const CLI_LOG_LEVEL_VALUES = ALLOWED_LOG_LEVELS.join("|");

/** Parses `--log-level` and raises Commander-compatible errors for invalid values. */
export function parseCliLogLevelOption(value: string): LogLevel {
  const parsed = tryParseLogLevel(value);
  if (!parsed) {
    throw new InvalidArgumentError(`Invalid --log-level (use ${CLI_LOG_LEVEL_VALUES})`);
  }
  return parsed;
}
