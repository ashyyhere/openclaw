// Vitest project config for ACP tests.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Create the ACP Vitest project config. */
export function createAcpVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(["src/acp/**/*.test.ts"], {
    dir: "src/acp",
    env,
    name: "acp",
  });
}

/** Default ACP Vitest project configuration. */
export default createAcpVitestConfig();
