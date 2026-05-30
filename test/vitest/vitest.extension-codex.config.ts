// Vitest project config for Codex plugin tests.
import { codexExtensionTestRoots } from "./vitest.extension-codex-paths.mjs";
import { loadPatternListFromEnv } from "./vitest.pattern-file.ts";
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Load Codex plugin include patterns from the Vitest include-file env var. */
export function loadIncludePatternsFromEnv(
  env: Record<string, string | undefined> = process.env,
): string[] | null {
  return loadPatternListFromEnv("OPENCLAW_VITEST_INCLUDE_FILE", env);
}

/** Create the scoped Vitest config for Codex plugin tests. */
export function createExtensionCodexVitestConfig(
  env: Record<string, string | undefined> = process.env,
) {
  return createScopedVitestConfig(
    loadIncludePatternsFromEnv(env) ??
      codexExtensionTestRoots.map((root) => `${root}/**/*.test.ts`),
    {
      dir: "extensions",
      env,
      name: "extension-codex",
      passWithNoTests: true,
      setupFiles: ["test/setup.extensions.ts"],
    },
  );
}

/** Default Codex plugin Vitest project configuration. */
export default createExtensionCodexVitestConfig();
