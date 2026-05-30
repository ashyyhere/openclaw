// Agents Vitest config scopes the agent test project to agent source patterns.
import { agentsAllTestPatterns } from "./vitest.agents-paths.mjs";
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Creates the Vitest project config for all agent tests. */
export function createAgentsVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(agentsAllTestPatterns, {
    dir: "src/agents",
    env,
    name: "agents",
  });
}

/** Default Agents Vitest project config. */
export default createAgentsVitestConfig();
