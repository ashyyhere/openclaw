/** Applies base config defaults during onboarding. */
import { setConfigValueAtPath } from "../config/config-paths.js";
import type { DmScope } from "../config/types.base.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ToolProfileId } from "../config/types.tools.js";

/** Reused constant for ONBOARDING DEFAULT DM SCOPE behavior in src/commands. */
export const ONBOARDING_DEFAULT_DM_SCOPE: DmScope = "per-channel-peer";
/** Reused constant for ONBOARDING DEFAULT TOOLS PROFILE behavior in src/commands. */
export const ONBOARDING_DEFAULT_TOOLS_PROFILE: ToolProfileId = "coding";

/** Reused helper for apply Local Setup Workspace Config behavior in src/commands. */
export function applyLocalSetupWorkspaceConfig(
  baseConfig: OpenClawConfig,
  workspaceDir: string,
): OpenClawConfig {
  return {
    ...baseConfig,
    agents: {
      ...baseConfig.agents,
      defaults: {
        ...baseConfig.agents?.defaults,
        workspace: workspaceDir,
      },
    },
    gateway: {
      ...baseConfig.gateway,
      mode: "local",
    },
    session: {
      ...baseConfig.session,
      dmScope: baseConfig.session?.dmScope ?? ONBOARDING_DEFAULT_DM_SCOPE,
    },
    tools: {
      ...baseConfig.tools,
      profile: baseConfig.tools?.profile ?? ONBOARDING_DEFAULT_TOOLS_PROFILE,
    },
  };
}

/** Reused helper for apply Skip Bootstrap Config behavior in src/commands. */
export function applySkipBootstrapConfig(cfg: OpenClawConfig): OpenClawConfig {
  const next = structuredClone(cfg);
  setConfigValueAtPath(
    next as Record<string, unknown>,
    ["agents", "defaults", "skipBootstrap"],
    true,
  );
  return next;
}
