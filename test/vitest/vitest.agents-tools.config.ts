// Agent tools Vitest config serializes tool tests to avoid shared fixture races.
import { agentsToolsTestPatterns } from "./vitest.agents-paths.mjs";
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Creates the agent tools Vitest project config. */
export function createAgentsToolsVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(agentsToolsTestPatterns, {
    dir: "src/agents",
    env,
    fileParallelism: false,
    name: "agents-tools",
  });
}

/** Default agent tools Vitest project config. */
export default createAgentsToolsVitestConfig();
