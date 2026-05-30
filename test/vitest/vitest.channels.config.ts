// Channels Vitest config scopes core channel tests and supports env-provided narrowed globs.
import { coreChannelTestInclude } from "./vitest.channel-paths.mjs";
import { loadPatternListFromEnv } from "./vitest.pattern-file.ts";
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Loads optional core channel test include patterns from an env-provided pattern file. */
export function loadIncludePatternsFromEnv(
  env: Record<string, string | undefined> = process.env,
): string[] | null {
  return loadPatternListFromEnv("OPENCLAW_VITEST_INCLUDE_FILE", env);
}

/** Creates the channels Vitest project config. */
export function createChannelsVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(loadIncludePatternsFromEnv(env) ?? coreChannelTestInclude, {
    env,
    exclude: ["src/gateway/**", "src/channels/plugins/contracts/**"],
    name: "channels",
    passWithNoTests: true,
  });
}

/** Default channels Vitest project config. */
export default createChannelsVitestConfig();
