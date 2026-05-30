// Vitest project config for shared messaging plugin tests.
import { messagingExtensionTestRoots } from "./vitest.extension-messaging-paths.mjs";
import { loadPatternListFromEnv } from "./vitest.pattern-file.ts";
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Load messaging plugin include patterns from the Vitest include-file env var. */
export function loadIncludePatternsFromEnv(
  env: Record<string, string | undefined> = process.env,
): string[] | null {
  return loadPatternListFromEnv("OPENCLAW_VITEST_INCLUDE_FILE", env);
}

/** Create the scoped Vitest config for shared messaging plugin tests. */
export function createExtensionMessagingVitestConfig(
  env: Record<string, string | undefined> = process.env,
) {
  return createScopedVitestConfig(
    loadIncludePatternsFromEnv(env) ??
      messagingExtensionTestRoots.map((root) => `${root}/**/*.test.ts`),
    {
      dir: "extensions",
      env,
      name: "extension-messaging",
      passWithNoTests: true,
      setupFiles: ["test/setup.extensions.ts"],
    },
  );
}

/** Default messaging plugin Vitest project configuration. */
export default createExtensionMessagingVitestConfig();
