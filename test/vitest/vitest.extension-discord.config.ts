// test/vitest vitest extension discord config helpers and runtime behavior.
import { createSingleChannelExtensionVitestConfig } from "./vitest.extension-channel-single-config.ts";

export function createExtensionDiscordVitestConfig(
  env: Record<string, string | undefined> = process.env,
) {
  return createSingleChannelExtensionVitestConfig("discord", env);
}

export default createExtensionDiscordVitestConfig();
