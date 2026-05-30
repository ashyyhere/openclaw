// Agent core Vitest config scopes tests to core agent runtime patterns.
import { agentsCoreTestPatterns } from "./vitest.agents-paths.mjs";
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Creates the agent core Vitest project config. */
export function createAgentsCoreVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(agentsCoreTestPatterns, {
    dir: "src/agents",
    env,
    name: "agents-core",
  });
}

/** Default agent core Vitest project config. */
export default createAgentsCoreVitestConfig();
