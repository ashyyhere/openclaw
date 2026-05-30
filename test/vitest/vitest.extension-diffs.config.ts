// Vitest project config for Diffs plugin tests.
import { diffsExtensionTestRoots } from "./vitest.extension-diffs-paths.mjs";
import { loadPatternListFromEnv } from "./vitest.pattern-file.ts";
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Load Diffs plugin include patterns from the Vitest include-file env var. */
export function loadIncludePatternsFromEnv(
  env: Record<string, string | undefined> = process.env,
): string[] | null {
  return loadPatternListFromEnv("OPENCLAW_VITEST_INCLUDE_FILE", env);
}

/** Create the scoped Vitest config for Diffs plugin tests. */
export function createExtensionDiffsVitestConfig(
  env: Record<string, string | undefined> = process.env,
) {
  return createScopedVitestConfig(
    loadIncludePatternsFromEnv(env) ??
      diffsExtensionTestRoots.map((root) => `${root}/**/*.test.ts`),
    {
      dir: "extensions",
      env,
      name: "extension-diffs",
      passWithNoTests: true,
      setupFiles: ["test/setup.extensions.ts"],
    },
  );
}

/** Default Diffs plugin Vitest project configuration. */
export default createExtensionDiffsVitestConfig();
