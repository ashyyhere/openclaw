// Config mutation helpers used by chat commands.
import { setConfigValueAtPath, unsetConfigValueAtPath } from "../../config/config-paths.js";
import {
  transformConfigFileWithRetry,
  validateConfigObjectWithPlugins,
} from "../../config/config.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { setPluginEnabledInConfig } from "../../plugins/toggle-config.js";

/** Reused class for Auto Reply Config Mutation Error behavior in src/auto-reply/reply. */
export class AutoReplyConfigMutationError extends Error {}

class AutoReplyConfigNoopMutation extends Error {}

/** Reused helper for format Auto Reply Config Mutation Error behavior in src/auto-reply/reply. */
export function formatAutoReplyConfigMutationError(error: unknown): string | null {
  return error instanceof AutoReplyConfigMutationError ? error.message : null;
}

function assertValidConfig(
  next: Record<string, unknown>,
  action: string,
): { config: OpenClawConfig } {
  const validated = validateConfigObjectWithPlugins(next);
  if (!validated.ok) {
    const issue = validated.issues[0];
    throw new AutoReplyConfigMutationError(
      `Config invalid after ${action} (${issue.path}: ${issue.message}).`,
    );
  }
  return { config: validated.config };
}

/** Reused helper for unset Config Path behavior in src/auto-reply/reply. */
export async function unsetConfigPath(path: string[]): Promise<boolean> {
  try {
    await transformConfigFileWithRetry({
      base: "source",
      afterWrite: { mode: "auto" },
      transform: (currentConfig) => {
        const next = structuredClone(currentConfig) as Record<string, unknown>;
        const removed = unsetConfigValueAtPath(next, path);
        if (!removed) {
          throw new AutoReplyConfigNoopMutation();
        }
        return {
          nextConfig: assertValidConfig(next, "unset").config,
        };
      },
    });
    return true;
  } catch (error) {
    if (error instanceof AutoReplyConfigNoopMutation) {
      return false;
    }
    throw error;
  }
}

/** Reused helper for set Config Path behavior in src/auto-reply/reply. */
export async function setConfigPath(path: string[], value: unknown): Promise<void> {
  await transformConfigFileWithRetry({
    base: "source",
    afterWrite: { mode: "auto" },
    transform: (currentConfig) => {
      const next = structuredClone(currentConfig) as Record<string, unknown>;
      setConfigValueAtPath(next, path, value);
      return { nextConfig: assertValidConfig(next, "set").config };
    },
  });
}

/** Reused helper for set Plugin Enabled From Command behavior in src/auto-reply/reply. */
export async function setPluginEnabledFromCommand(params: {
  pluginId: string;
  enabled: boolean;
  action: "enable" | "disable";
}): Promise<OpenClawConfig> {
  const committed = await transformConfigFileWithRetry({
    afterWrite: { mode: "auto" },
    transform: (currentConfig) => {
      const next = setPluginEnabledInConfig(
        structuredClone(currentConfig),
        params.pluginId,
        params.enabled,
      );
      return { nextConfig: assertValidConfig(next, `/plugins ${params.action}`).config };
    },
  });
  return committed.nextConfig;
}

type AllowlistConfigEditResult =
  | {
      kind?: "ok" | "invalid-entry";
      changed?: boolean;
    }
  | null
  | undefined;

type MaybePromise<T> = T | Promise<T>;

type ApplyAllowlistConfigEdit = (params: {
  cfg: OpenClawConfig;
  parsedConfig: Record<string, unknown>;
  accountId?: string | null;
  scope: "dm" | "group";
  action: "add" | "remove";
  entry: string;
}) => MaybePromise<AllowlistConfigEditResult>;

/** Reused helper for apply Allowlist Config Mutation behavior in src/auto-reply/reply. */
export async function applyAllowlistConfigMutation(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  scope: "dm" | "group";
  action: "add" | "remove";
  entry: string;
  applyConfigEdit: ApplyAllowlistConfigEdit;
}): Promise<void> {
  await transformConfigFileWithRetry({
    base: "source",
    afterWrite: { mode: "auto" },
    transform: async (currentConfig) => {
      const latestParsedConfig = structuredClone(currentConfig) as Record<string, unknown>;
      const latestEditResult = await params.applyConfigEdit({
        cfg: currentConfig,
        parsedConfig: latestParsedConfig,
        accountId: params.accountId,
        scope: params.scope,
        action: params.action,
        entry: params.entry,
      });
      if (!latestEditResult || latestEditResult.kind === "invalid-entry") {
        throw new AutoReplyConfigMutationError("Invalid allowlist entry.");
      }
      if (!latestEditResult.changed) {
        return { nextConfig: currentConfig };
      }
      return {
        nextConfig: assertValidConfig(latestParsedConfig, "update").config,
      };
    },
  });
}
