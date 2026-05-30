// Vitest project config for LINE plugin tests.
import { createSingleChannelExtensionVitestConfig } from "./vitest.extension-channel-single-config.ts";

/** Create the scoped Vitest config for LINE plugin tests. */
export function createExtensionLineVitestConfig(
  env: Record<string, string | undefined> = process.env,
) {
  return createSingleChannelExtensionVitestConfig("line", env);
}

/** Default LINE plugin Vitest project configuration. */
export default createExtensionLineVitestConfig();
