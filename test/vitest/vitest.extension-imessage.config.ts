// iMessage extension Vitest config delegates to the single-channel extension helper.
import { createSingleChannelExtensionVitestConfig } from "./vitest.extension-channel-single-config.ts";

/** Creates the iMessage extension Vitest project config. */
export function createExtensionImessageVitestConfig(
  env: Record<string, string | undefined> = process.env,
) {
  return createSingleChannelExtensionVitestConfig("imessage", env);
}

/** Default iMessage extension Vitest project config. */
export default createExtensionImessageVitestConfig();
