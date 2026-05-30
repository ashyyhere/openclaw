// Telegram extension Vitest config scopes tests to Telegram plugin shards and env filters.
import { telegramExtensionTestRoots } from "./vitest.extension-telegram-paths.mjs";
import { loadPatternListFromEnv } from "./vitest.pattern-file.ts";
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Loads optional Telegram test include patterns from an env-provided pattern file. */
export function loadIncludePatternsFromEnv(
  env: Record<string, string | undefined> = process.env,
): string[] | null {
  return loadPatternListFromEnv("OPENCLAW_VITEST_INCLUDE_FILE", env);
}

/** Creates the Telegram extension Vitest project config. */
export function createExtensionTelegramVitestConfig(
  env: Record<string, string | undefined> = process.env,
) {
  return createScopedVitestConfig(
    loadIncludePatternsFromEnv(env) ??
      telegramExtensionTestRoots.map((root) => `${root}/**/*.test.ts`),
    {
      dir: "extensions",
      env,
      fileParallelism: false,
      name: "extension-telegram",
      passWithNoTests: true,
      setupFiles: ["test/setup.extensions.ts"],
    },
  );
}

/** Default Telegram extension Vitest project config. */
export default createExtensionTelegramVitestConfig();
