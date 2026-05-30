// Vitest project config for Matrix plugin tests.
import { matrixExtensionTestRoots } from "./vitest.extension-matrix-paths.mjs";
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Create the scoped Vitest config for Matrix plugin tests. */
export function createExtensionMatrixVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(
    matrixExtensionTestRoots.map((root) => `${root}/**/*.test.ts`),
    {
      dir: "extensions",
      env,
      name: "extension-matrix",
      passWithNoTests: true,
      setupFiles: ["test/setup.extensions.ts"],
    },
  );
}

/** Default Matrix plugin Vitest project configuration. */
export default createExtensionMatrixVitestConfig();
