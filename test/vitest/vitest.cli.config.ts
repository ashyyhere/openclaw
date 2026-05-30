// Vitest project config for CLI tests.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Create the scoped Vitest config for CLI tests. */
export function createCliVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(["src/cli/**/*.test.ts"], {
    dir: "src/cli",
    env,
    name: "cli",
    passWithNoTests: true,
  });
}

/** Default CLI Vitest project configuration. */
export default createCliVitestConfig();
