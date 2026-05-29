// test/vitest vitest extension clickclack config helpers and runtime behavior.
import { createSingleChannelExtensionVitestConfig } from "./vitest.extension-channel-single-config.ts";

export function createExtensionClickClackVitestConfig(
  env: Record<string, string | undefined> = process.env,
) {
  return createSingleChannelExtensionVitestConfig("clickclack", env);
}

export default createExtensionClickClackVitestConfig();
