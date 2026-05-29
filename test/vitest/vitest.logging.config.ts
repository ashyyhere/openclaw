// test/vitest vitest logging config helpers and runtime behavior.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

export function createLoggingVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(["src/logging/**/*.test.ts"], {
    dir: "src",
    env,
    name: "logging",
    passWithNoTests: true,
  });
}

export default createLoggingVitestConfig();
