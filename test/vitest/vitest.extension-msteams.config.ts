// Vitest project config for Microsoft Teams plugin tests.
import { msTeamsExtensionTestRoots } from "./vitest.extension-msteams-paths.mjs";
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Create the scoped Vitest config for Microsoft Teams plugin tests. */
export function createExtensionMsTeamsVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(
    msTeamsExtensionTestRoots.map((root) => `${root}/**/*.test.ts`),
    {
      dir: "extensions",
      env,
      name: "extension-msteams",
      passWithNoTests: true,
      setupFiles: ["test/setup.extensions.ts"],
    },
  );
}

/** Default Microsoft Teams plugin Vitest project configuration. */
export default createExtensionMsTeamsVitestConfig();
