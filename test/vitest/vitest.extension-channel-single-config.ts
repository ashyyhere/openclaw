// Single-channel extension Vitest config helper builds per-plugin extension shards.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Creates a Vitest project config for one channel extension id. */
export function createSingleChannelExtensionVitestConfig(
  extensionId: string,
  env: Record<string, string | undefined> = process.env,
) {
  return createScopedVitestConfig([`extensions/${extensionId}/**/*.test.ts`], {
    dir: "extensions",
    env,
    name: `extension-${extensionId}`,
    passWithNoTests: true,
    setupFiles: ["test/setup.extensions.ts"],
  });
}
