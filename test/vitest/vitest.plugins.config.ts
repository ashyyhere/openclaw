// Plugins Vitest config scopes core plugin loader tests outside contract shards.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Creates the plugins Vitest project config. */
export function createPluginsVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(["src/plugins/**/*.test.ts"], {
    dir: "src/plugins",
    env,
    exclude: ["src/plugins/contracts/**", "src/plugins/loader.test.ts"],
    isolate: false,
    name: "plugins",
    passWithNoTests: true,
  });
}

/** Default plugins Vitest project config. */
export default createPluginsVitestConfig();
