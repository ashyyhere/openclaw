// Agent support Vitest config scopes tests to support modules while excluding heavier shards.
import { agentsSupportExcludePatterns, agentsSupportTestPatterns } from "./vitest.agents-paths.mjs";
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Creates the agent support Vitest project config. */
export function createAgentsSupportVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(agentsSupportTestPatterns, {
    dir: "src/agents",
    env,
    exclude: agentsSupportExcludePatterns,
    name: "agents-support",
  });
}

/** Default agent support Vitest project config. */
export default createAgentsSupportVitestConfig();
