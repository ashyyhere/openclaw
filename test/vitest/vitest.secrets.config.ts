// Vitest project config for secret-management tests.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Create the scoped Vitest config for secret-management tests. */
export function createSecretsVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(["src/secrets/**/*.test.ts"], {
    dir: "src/secrets",
    env,
    name: "secrets",
    passWithNoTests: true,
  });
}

/** Default secrets Vitest project configuration. */
export default createSecretsVitestConfig();
