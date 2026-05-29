// test/vitest vitest secrets config helpers and runtime behavior.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

export function createSecretsVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(["src/secrets/**/*.test.ts"], {
    dir: "src/secrets",
    env,
    name: "secrets",
    passWithNoTests: true,
  });
}

export default createSecretsVitestConfig();
