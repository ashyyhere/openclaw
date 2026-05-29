// config io meta helpers and runtime behavior.
import { VERSION } from "../version.js";
import type { OpenClawConfig } from "./types.openclaw.js";

/** Reused constant for AUTO MANAGED CONFIG META FIELDS behavior in src/config. */
export const AUTO_MANAGED_CONFIG_META_FIELDS = {
  lastTouchedVersion: "lastTouchedVersion",
  lastTouchedAt: "lastTouchedAt",
} as const;

/** Reused constant for AUTO MANAGED CONFIG META PATHS behavior in src/config. */
export const AUTO_MANAGED_CONFIG_META_PATHS = [
  ["meta", AUTO_MANAGED_CONFIG_META_FIELDS.lastTouchedVersion],
  ["meta", AUTO_MANAGED_CONFIG_META_FIELDS.lastTouchedAt],
] as const;

/** Reused helper for stamp Config Write Metadata behavior in src/config. */
export function stampConfigWriteMetadata(
  cfg: OpenClawConfig,
  now: string = new Date().toISOString(),
  version: string = VERSION,
): OpenClawConfig {
  return {
    ...cfg,
    meta: {
      ...cfg.meta,
      [AUTO_MANAGED_CONFIG_META_FIELDS.lastTouchedVersion]: version,
      [AUTO_MANAGED_CONFIG_META_FIELDS.lastTouchedAt]: now,
    },
  };
}
