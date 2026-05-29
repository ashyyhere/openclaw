// test/vitest vitest extension line config helpers and runtime behavior.
import { createSingleChannelExtensionVitestConfig } from "./vitest.extension-channel-single-config.ts";

export function createExtensionLineVitestConfig(
  env: Record<string, string | undefined> = process.env,
) {
  return createSingleChannelExtensionVitestConfig("line", env);
}

export default createExtensionLineVitestConfig();
