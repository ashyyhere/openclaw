// test/vitest vitest agents core config helpers and runtime behavior.
import { agentsCoreTestPatterns } from "./vitest.agents-paths.mjs";
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

export function createAgentsCoreVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(agentsCoreTestPatterns, {
    dir: "src/agents",
    env,
    name: "agents-core",
  });
}

export default createAgentsCoreVitestConfig();
