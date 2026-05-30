// ClickClack extension Vitest config scopes tests through the single-channel helper.
import { createSingleChannelExtensionVitestConfig } from "./vitest.extension-channel-single-config.ts";

/** Creates the ClickClack extension Vitest project config. */
export function createExtensionClickClackVitestConfig(
  env: Record<string, string | undefined> = process.env,
) {
  return createSingleChannelExtensionVitestConfig("clickclack", env);
}

/** Default ClickClack extension Vitest project config. */
export default createExtensionClickClackVitestConfig();
