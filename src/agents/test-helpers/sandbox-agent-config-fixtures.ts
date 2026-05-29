/** Config fixtures for sandbox-restricted agent tests. */
import type { OpenClawConfig } from "../../config/types.openclaw.js";

type AgentToolsConfig = NonNullable<NonNullable<OpenClawConfig["agents"]>["list"]>[number]["tools"];
type SandboxToolsConfig = {
  allow?: string[];
  deny?: string[];
};

/** Creates an agent config with explicit sandbox tool allow/deny lists. */
export function createRestrictedAgentSandboxConfig(params: {
  agentTools?: AgentToolsConfig;
  globalSandboxTools?: SandboxToolsConfig;
  workspace?: string;
}): OpenClawConfig {
  return {
    agents: {
      defaults: {
        sandbox: {
          mode: "all",
          scope: "agent",
        },
      },
      list: [
        {
          id: "restricted",
          workspace: params.workspace ?? "~/openclaw-restricted",
          sandbox: {
            mode: "all",
            scope: "agent",
          },
          ...(params.agentTools ? { tools: params.agentTools } : {}),
        },
      ],
    },
    ...(params.globalSandboxTools
      ? {
          tools: {
            sandbox: {
              tools: params.globalSandboxTools,
            },
          },
        }
      : {}),
  } as OpenClawConfig;
}
