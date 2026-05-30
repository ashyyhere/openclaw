// Voice Call extension Vitest config scopes tests to voice-call plugin shards and env filters.
import { voiceCallExtensionTestRoots } from "./vitest.extension-voice-call-paths.mjs";
import { loadPatternListFromEnv } from "./vitest.pattern-file.ts";
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Loads optional Voice Call test include patterns from an env-provided pattern file. */
export function loadIncludePatternsFromEnv(
  env: Record<string, string | undefined> = process.env,
): string[] | null {
  return loadPatternListFromEnv("OPENCLAW_VITEST_INCLUDE_FILE", env);
}

/** Creates the Voice Call extension Vitest project config. */
export function createExtensionVoiceCallVitestConfig(
  env: Record<string, string | undefined> = process.env,
) {
  return createScopedVitestConfig(
    loadIncludePatternsFromEnv(env) ??
      voiceCallExtensionTestRoots.map((root) => `${root}/**/*.test.ts`),
    {
      dir: "extensions",
      env,
      name: "extension-voice-call",
      passWithNoTests: true,
      setupFiles: ["test/setup.extensions.ts"],
    },
  );
}

/** Default Voice Call extension Vitest project config. */
export default createExtensionVoiceCallVitestConfig();
