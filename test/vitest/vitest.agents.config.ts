// test/vitest vitest agents config helpers and runtime behavior.
import { agentsAllTestPatterns } from "./vitest.agents-paths.mjs";
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

export function createAgentsVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(agentsAllTestPatterns, {
    dir: "src/agents",
    env,
    name: "agents",
  });
}

export default createAgentsVitestConfig();
