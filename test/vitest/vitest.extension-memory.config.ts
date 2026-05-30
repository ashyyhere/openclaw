// Vitest project config for memory plugin tests.
import { memoryExtensionTestRoots } from "./vitest.extension-memory-paths.mjs";
import { loadPatternListFromEnv } from "./vitest.pattern-file.ts";
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Load memory plugin include patterns from the Vitest include-file env var. */
export function loadIncludePatternsFromEnv(
  env: Record<string, string | undefined> = process.env,
): string[] | null {
  return loadPatternListFromEnv("OPENCLAW_VITEST_INCLUDE_FILE", env);
}

/** Create the scoped Vitest config for memory plugin tests. */
export function createExtensionMemoryVitestConfig(
  env: Record<string, string | undefined> = process.env,
) {
  return createScopedVitestConfig(
    loadIncludePatternsFromEnv(env) ??
      memoryExtensionTestRoots.map((root) => `${root}/**/*.test.ts`),
    {
      dir: "extensions",
      env,
      name: "extension-memory",
      passWithNoTests: true,
      setupFiles: ["test/setup.extensions.ts"],
    },
  );
}

/** Default memory plugin Vitest project configuration. */
export default createExtensionMemoryVitestConfig();
