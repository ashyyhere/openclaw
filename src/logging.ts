// Public logging facade for console settings, file logger settings, subsystem loggers, and test overrides.
import type { ConsoleLoggerSettings, ConsoleStyle } from "./logging/console.js";
import {
  enableConsoleCapture,
  getConsoleSettings,
  getResolvedConsoleSettings,
  routeLogsToStderr,
  setConsoleSubsystemFilter,
  setConsoleConfigLoaderForTests,
  setConsoleTimestampPrefix,
  shouldLogSubsystemToConsole,
} from "./logging/console.js";
import type { LogLevel } from "./logging/levels.js";
import { ALLOWED_LOG_LEVELS, levelToMinLevel, normalizeLogLevel } from "./logging/levels.js";
import type { LoggerResolvedSettings, LoggerSettings, PinoLikeLogger } from "./logging/logger.js";
import {
  DEFAULT_LOG_DIR,
  DEFAULT_LOG_FILE,
  getChildLogger,
  getLogger,
  getResolvedLoggerSettings,
  isFileLogLevelEnabled,
  resetLogger,
  setLoggerConfigLoaderForTests,
  setLoggerOverride,
  toPinoLikeLogger,
} from "./logging/logger.js";
import type { SubsystemLogger } from "./logging/subsystem.js";
import {
  createSubsystemLogger,
  createSubsystemRuntime,
  runtimeForLogger,
  stripRedundantSubsystemPrefixForConsole,
} from "./logging/subsystem.js";

/** Re-export logging runtime helpers and constants from the narrow logging modules. */
export {
  enableConsoleCapture,
  getConsoleSettings,
  getResolvedConsoleSettings,
  routeLogsToStderr,
  setConsoleSubsystemFilter,
  setConsoleConfigLoaderForTests,
  setConsoleTimestampPrefix,
  shouldLogSubsystemToConsole,
  ALLOWED_LOG_LEVELS,
  levelToMinLevel,
  normalizeLogLevel,
  DEFAULT_LOG_DIR,
  DEFAULT_LOG_FILE,
  getChildLogger,
  getLogger,
  getResolvedLoggerSettings,
  isFileLogLevelEnabled,
  resetLogger,
  setLoggerConfigLoaderForTests,
  setLoggerOverride,
  toPinoLikeLogger,
  createSubsystemLogger,
  createSubsystemRuntime,
  runtimeForLogger,
  stripRedundantSubsystemPrefixForConsole,
};

/** Re-export logging type contracts for consumers of the facade. */
export type {
  ConsoleLoggerSettings,
  ConsoleStyle,
  LogLevel,
  LoggerResolvedSettings,
  LoggerSettings,
  PinoLikeLogger,
  SubsystemLogger,
};
