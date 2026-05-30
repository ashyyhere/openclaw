// Logging Vitest config scopes tests to the logging source tree.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Creates the logging Vitest project config. */
export function createLoggingVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(["src/logging/**/*.test.ts"], {
    dir: "src",
    env,
    name: "logging",
    passWithNoTests: true,
  });
}

/** Default logging Vitest project config. */
export default createLoggingVitestConfig();
