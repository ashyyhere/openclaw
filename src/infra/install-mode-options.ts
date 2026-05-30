// Normalizes shared install/update option defaults for installer helpers.
type InstallMode = "install" | "update";

type InstallModeOptions<TLogger> = {
  logger?: TLogger;
  mode?: InstallMode;
  dryRun?: boolean;
};

type TimedInstallModeOptions<TLogger> = InstallModeOptions<TLogger> & {
  timeoutMs?: number;
};

/** Applies default logger, mode, and dry-run settings for install/update flows. */
export function resolveInstallModeOptions<TLogger>(
  params: InstallModeOptions<TLogger>,
  defaultLogger: TLogger,
): {
  logger: TLogger;
  mode: InstallMode;
  dryRun: boolean;
} {
  return {
    logger: params.logger ?? defaultLogger,
    mode: params.mode ?? "install",
    dryRun: params.dryRun ?? false,
  };
}

/** Applies install/update defaults plus a timeout default. */
export function resolveTimedInstallModeOptions<TLogger>(
  params: TimedInstallModeOptions<TLogger>,
  defaultLogger: TLogger,
  defaultTimeoutMs = 120_000,
): {
  logger: TLogger;
  timeoutMs: number;
  mode: InstallMode;
  dryRun: boolean;
} {
  return {
    ...resolveInstallModeOptions(params, defaultLogger),
    timeoutMs: params.timeoutMs ?? defaultTimeoutMs,
  };
}
