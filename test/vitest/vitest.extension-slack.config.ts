// Vitest project config for Slack plugin tests.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Create the scoped Vitest config for Slack plugin tests. */
export function createExtensionSlackVitestConfig(
  env: Record<string, string | undefined> = process.env,
) {
  return createScopedVitestConfig(["extensions/slack/**/*.test.ts"], {
    dir: "extensions",
    env,
    includeOpenClawRuntimeSetup: false,
    name: "extension-slack",
    passWithNoTests: true,
    setupFiles: ["test/setup.extensions.ts"],
    fileParallelism: false,
  });
}

/** Default Slack plugin Vitest project configuration. */
export default createExtensionSlackVitestConfig();
