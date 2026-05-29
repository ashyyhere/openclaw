// test/vitest vitest agents embedded agent config helpers and runtime behavior.
import { agentsEmbeddedTestPatterns } from "./vitest.agents-paths.mjs";
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

export function createAgentsEmbeddedVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(agentsEmbeddedTestPatterns, {
    dir: "src/agents",
    env,
    name: "agents-embedded-agent",
  });
}

export default createAgentsEmbeddedVitestConfig();
