// Discord extension Vitest config delegates to the single-channel extension helper.
import { createSingleChannelExtensionVitestConfig } from "./vitest.extension-channel-single-config.ts";

/** Creates the Discord extension Vitest project config. */
export function createExtensionDiscordVitestConfig(
  env: Record<string, string | undefined> = process.env,
) {
  return createSingleChannelExtensionVitestConfig("discord", env);
}

/** Default Discord extension Vitest project config. */
export default createExtensionDiscordVitestConfig();
