// Active Memory extension Vitest config scopes tests to generated Active Memory root lists.
import { activeMemoryExtensionTestRoots } from "./vitest.extension-active-memory-paths.mjs";
import { loadPatternListFromEnv } from "./vitest.pattern-file.ts";
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Loads optional Active Memory test include patterns from an env-provided pattern file. */
export function loadIncludePatternsFromEnv(
  env: Record<string, string | undefined> = process.env,
): string[] | null {
  return loadPatternListFromEnv("OPENCLAW_VITEST_INCLUDE_FILE", env);
}

/** Creates the Active Memory extension Vitest project config. */
export function createExtensionActiveMemoryVitestConfig(
  env: Record<string, string | undefined> = process.env,
) {
  return createScopedVitestConfig(
    loadIncludePatternsFromEnv(env) ??
      activeMemoryExtensionTestRoots.map((root) => `${root}/**/*.test.ts`),
    {
      dir: "extensions",
      env,
      name: "extension-active-memory",
      passWithNoTests: true,
      setupFiles: ["test/setup.extensions.ts"],
    },
  );
}

/** Default Active Memory extension Vitest project config. */
export default createExtensionActiveMemoryVitestConfig();
