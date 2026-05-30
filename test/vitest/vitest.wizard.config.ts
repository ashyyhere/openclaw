// Wizard Vitest config scopes tests to setup wizard source files.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Creates the wizard Vitest project config. */
export function createWizardVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(["src/wizard/**/*.test.ts"], {
    dir: "src",
    env,
    name: "wizard",
    passWithNoTests: true,
  });
}

/** Default wizard Vitest project config. */
export default createWizardVitestConfig();
