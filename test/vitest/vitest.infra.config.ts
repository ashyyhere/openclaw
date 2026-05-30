// Infra Vitest config scopes infrastructure tests while excluding boundary-owned cases.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";
import { boundaryTestFiles } from "./vitest.unit-paths.mjs";

/** Creates the infra Vitest project config. */
export function createInfraVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(["src/infra/**/*.test.ts"], {
    dir: "src",
    env,
    exclude: boundaryTestFiles,
    isolate: true,
    name: "infra",
    passWithNoTests: true,
  });
}

/** Default infra Vitest project config. */
export default createInfraVitestConfig();
