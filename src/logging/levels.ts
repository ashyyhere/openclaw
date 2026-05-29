// Defines OpenClaw log levels and maps them to the tslog runtime filter.
/** Ordered list of accepted log-level strings for config and CLI parsing. */
export const ALLOWED_LOG_LEVELS = [
  "silent",
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace",
] as const;

/** Normalized log level accepted by OpenClaw logging configuration. */
export type LogLevel = (typeof ALLOWED_LOG_LEVELS)[number];

/** Parses a user-supplied log level, returning undefined for unknown values. */
export function tryParseLogLevel(level?: string): LogLevel | undefined {
  if (typeof level !== "string") {
    return undefined;
  }
  const candidate = level.trim();
  return ALLOWED_LOG_LEVELS.includes(candidate as LogLevel) ? (candidate as LogLevel) : undefined;
}

/** Parses a log level and falls back when the value is absent or invalid. */
export function normalizeLogLevel(level?: string, fallback: LogLevel = "info") {
  return tryParseLogLevel(level) ?? fallback;
}

/** Converts an OpenClaw log level into tslog's numeric minimum level. */
export function levelToMinLevel(level: LogLevel): number {
  // tslog v4 logLevelId (src/index.ts): silly=0, trace=1, debug=2, info=3, warn=4, error=5, fatal=6
  // tslog filters: logLevelId < minLevel is dropped, so higher minLevel = more restrictive.
  const map: Record<LogLevel, number> = {
    trace: 1,
    debug: 2,
    info: 3,
    warn: 4,
    error: 5,
    fatal: 6,
    silent: Number.POSITIVE_INFINITY,
  };
  return map[level];
}
