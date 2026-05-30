// Vitest project config for jsdom UI tests and derived UI lanes.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";
import { jsdomOptimizedDeps } from "./vitest.shared.config.ts";
import { unitUiIncludePatterns } from "./vitest.ui-paths.mjs";

/** Create the scoped jsdom Vitest config for UI tests. */
export function createUiVitestConfig(
  env?: Record<string, string | undefined>,
  options?: { includePatterns?: string[]; name?: string },
) {
  const includePatterns = options?.includePatterns ?? ["ui/src/**/*.test.ts"];
  const exclude = options?.includePatterns
    ? []
    : [...unitUiIncludePatterns, "ui/src/**/*.e2e.test.ts"];
  return createScopedVitestConfig(includePatterns, {
    deps: jsdomOptimizedDeps,
    environment: "jsdom",
    env,
    exclude,
    excludeUnitFastTests: false,
    includeOpenClawRuntimeSetup: false,
    isolate: false,
    name: options?.name ?? "ui",
    setupFiles: ["ui/src/test-helpers/lit-warnings.setup.ts"],
  });
}

/** Default UI Vitest project configuration. */
export default createUiVitestConfig();
