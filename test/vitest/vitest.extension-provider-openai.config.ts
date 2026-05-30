// OpenAI provider extension Vitest config adds the ws wrapper alias required by provider tests.
import path from "node:path";
import { providerOpenAiExtensionTestRoots } from "./vitest.extension-provider-paths.mjs";
import { loadPatternListFromEnv } from "./vitest.pattern-file.ts";
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";
import { repoRoot } from "./vitest.shared.config.ts";

/** Loads optional OpenAI provider test include patterns from an env-provided pattern file. */
export function loadIncludePatternsFromEnv(
  env: Record<string, string | undefined> = process.env,
): string[] | null {
  return loadPatternListFromEnv("OPENCLAW_VITEST_INCLUDE_FILE", env);
}

/** Creates the OpenAI provider extension Vitest project config. */
export function createExtensionProviderOpenAiVitestConfig(
  env: Record<string, string | undefined> = process.env,
) {
  const config = createScopedVitestConfig(
    loadIncludePatternsFromEnv(env) ??
      providerOpenAiExtensionTestRoots.map((root) => `${root}/**/*.test.ts`),
    {
      dir: "extensions",
      env,
      name: "extension-provider-openai",
      passWithNoTests: true,
      setupFiles: ["test/setup.extensions.ts"],
    },
  );
  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: [
        ...(Array.isArray(config.resolve?.alias) ? config.resolve.alias : []),
        {
          find: /^ws$/u,
          replacement: path.join(repoRoot, "node_modules", "ws", "wrapper.mjs"),
        },
      ],
    },
  };
}

/** Default OpenAI provider extension Vitest project config. */
export default createExtensionProviderOpenAiVitestConfig();
