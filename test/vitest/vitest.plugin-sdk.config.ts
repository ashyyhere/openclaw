// Plugin SDK Vitest config isolates SDK unit tests from heavier plugin-dependent suites.
import { pluginSdkLightTestFiles } from "./vitest.plugin-sdk-paths.mjs";
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";
import { bundledPluginDependentUnitTestFiles } from "./vitest.unit-paths.mjs";

/** Creates the plugin SDK Vitest project config. */
export function createPluginSdkVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(["src/plugin-sdk/**/*.test.ts"], {
    dir: "src",
    env,
    exclude: [...pluginSdkLightTestFiles, ...bundledPluginDependentUnitTestFiles],
    name: "plugin-sdk",
    passWithNoTests: true,
  });
}

/** Default plugin SDK Vitest project config. */
export default createPluginSdkVitestConfig();
