// Vitest project config for terminal UI tests.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Create the scoped Vitest config for TUI tests. */
export function createTuiVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(["src/tui/**/*.test.ts"], {
    dir: "src",
    env,
    name: "tui",
    passWithNoTests: true,
  });
}

/** Default TUI Vitest project configuration. */
export default createTuiVitestConfig();
