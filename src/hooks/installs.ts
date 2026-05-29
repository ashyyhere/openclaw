// hooks installs helpers and runtime behavior.
import type { HookInstallRecord } from "../config/types.hooks.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";

/** Shared type for Hook Install Update in src/hooks. */
export type HookInstallUpdate = HookInstallRecord & { hookId: string };

/** Reused helper for record Hook Install behavior in src/hooks. */
export function recordHookInstall(cfg: OpenClawConfig, update: HookInstallUpdate): OpenClawConfig {
  const { hookId, ...record } = update;
  const installs = {
    ...cfg.hooks?.internal?.installs,
    [hookId]: {
      ...cfg.hooks?.internal?.installs?.[hookId],
      ...record,
      installedAt: record.installedAt ?? new Date().toISOString(),
    },
  };

  return {
    ...cfg,
    hooks: {
      ...cfg.hooks,
      internal: {
        ...cfg.hooks?.internal,
        installs: {
          ...installs,
          [hookId]: installs[hookId],
        },
      },
    },
  };
}
