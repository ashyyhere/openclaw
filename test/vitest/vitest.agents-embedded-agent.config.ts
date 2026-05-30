// Embedded agent Vitest config scopes tests to embedded-agent runtime patterns.
import { agentsEmbeddedTestPatterns } from "./vitest.agents-paths.mjs";
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Creates the embedded agent Vitest project config. */
export function createAgentsEmbeddedVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(agentsEmbeddedTestPatterns, {
    dir: "src/agents",
    env,
    name: "agents-embedded-agent",
  });
}

/** Default embedded agent Vitest project config. */
export default createAgentsEmbeddedVitestConfig();
