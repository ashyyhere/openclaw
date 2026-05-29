// Builds provider-facing migration contexts, report paths, and JSON-safe logging.
import path from "node:path";
import { getRuntimeConfig } from "../../config/config.js";
import { resolveStateDir } from "../../config/paths.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { MigrationProviderContext } from "../../plugins/types.js";
import type { RuntimeEnv } from "../../runtime.js";
import { timestampMsToIsoFileStamp } from "../../shared/number-coercion.js";

/** Reused helper for create Migration Logger behavior in src/commands/migrate. */
export function createMigrationLogger(runtime: RuntimeEnv, opts: { json?: boolean } = {}) {
  const info = opts.json ? runtime.error : runtime.log;
  return {
    debug: (message: string) => {
      if (process.env.OPENCLAW_VERBOSE === "1") {
        info(message);
      }
    },
    info: (message: string) => info(message),
    warn: (message: string) => runtime.error(message),
    error: (message: string) => runtime.error(message),
  };
}

/** Reused helper for build Migration Report Dir behavior in src/commands/migrate. */
export function buildMigrationReportDir(
  providerId: string,
  stateDir: string,
  nowMs = Date.now(),
): string {
  const stamp = timestampMsToIsoFileStamp(nowMs);
  return path.join(stateDir, "migration", providerId, stamp);
}

/** Reused helper for build Migration Context behavior in src/commands/migrate. */
export function buildMigrationContext(params: {
  source?: string;
  includeSecrets?: boolean;
  overwrite?: boolean;
  providerOptions?: Record<string, unknown>;
  backupPath?: string;
  configOverride?: OpenClawConfig;
  runtime: RuntimeEnv;
  reportDir?: string;
  json?: boolean;
}): MigrationProviderContext {
  const config = params.configOverride ?? getRuntimeConfig();
  const stateDir = resolveStateDir();
  return {
    config,
    stateDir,
    source: params.source,
    includeSecrets: Boolean(params.includeSecrets),
    overwrite: Boolean(params.overwrite),
    providerOptions: params.providerOptions,
    backupPath: params.backupPath,
    reportDir: params.reportDir,
    logger: createMigrationLogger(params.runtime, { json: params.json }),
  };
}
