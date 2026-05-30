// Vitest project config for command tests outside the commands-light lane.
import { commandsLightTestFiles } from "./vitest.commands-light-paths.mjs";
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Create the scoped Vitest config for command tests excluding commands-light files. */
export function createCommandsVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(["src/commands/**/*.test.ts"], {
    dir: "src/commands",
    env,
    exclude: commandsLightTestFiles,
    name: "commands",
  });
}

/** Default commands Vitest project configuration. */
export default createCommandsVitestConfig();
