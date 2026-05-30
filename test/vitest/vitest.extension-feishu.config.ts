// Vitest project config for Feishu plugin tests.
import { feishuExtensionTestRoots } from "./vitest.extension-feishu-paths.mjs";
import { loadPatternListFromEnv } from "./vitest.pattern-file.ts";
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Load Feishu plugin include patterns from the Vitest include-file env var. */
export function loadIncludePatternsFromEnv(
  env: Record<string, string | undefined> = process.env,
): string[] | null {
  return loadPatternListFromEnv("OPENCLAW_VITEST_INCLUDE_FILE", env);
}

/** Create the scoped Vitest config for Feishu plugin tests. */
export function createExtensionFeishuVitestConfig(
  env: Record<string, string | undefined> = process.env,
) {
  return createScopedVitestConfig(
    loadIncludePatternsFromEnv(env) ??
      feishuExtensionTestRoots.map((root) => `${root}/**/*.test.ts`),
    {
      dir: "extensions",
      env,
      includeOpenClawRuntimeSetup: false,
      name: "extension-feishu",
      passWithNoTests: true,
      setupFiles: ["test/setup.extensions.ts"],
    },
  );
}

/** Default Feishu plugin Vitest project configuration. */
export default createExtensionFeishuVitestConfig();
