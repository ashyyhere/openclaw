// secrets runtime auth integration test helpers helpers and runtime behavior.
import { vi } from "vitest";
import { clearConfigCache, clearRuntimeConfigSnapshot } from "../config/config.js";
import { captureEnv } from "../test-utils/env.js";
import type { SecretsRuntimeEnvSnapshot } from "./runtime-openai-file-fixture.test-helper.js";
/** Re-exported API for src/secrets. */
export {
  asConfig,
  createOpenAIFileRuntimeConfig,
  createOpenAIFileRuntimeFixture,
  EMPTY_LOADABLE_PLUGIN_ORIGINS,
  expectResolvedOpenAIRuntime,
  loadAuthStoreWithProfiles,
  OPENAI_ENV_KEY_REF,
  OPENAI_FILE_KEY_REF,
} from "./runtime-openai-file-fixture.test-helper.js";
/** Re-exported API for src/secrets, starting with Secrets Runtime Env Snapshot. */
export type { SecretsRuntimeEnvSnapshot } from "./runtime-openai-file-fixture.test-helper.js";
import { clearSecretsRuntimeSnapshot } from "./runtime.js";

const secretsRuntimePluginMocks = vi.hoisted(() => ({
  resolveExternalAuthProfilesWithPluginsMock: vi.fn(() => []),
  resolvePluginWebSearchProvidersMock: vi.fn(() => []),
}));

vi.mock("../plugins/web-search-providers.runtime.js", () => ({
  resolvePluginWebSearchProviders: secretsRuntimePluginMocks.resolvePluginWebSearchProvidersMock,
}));

vi.mock("../plugins/provider-runtime.js", () => ({
  resolveExternalAuthProfilesWithPlugins:
    secretsRuntimePluginMocks.resolveExternalAuthProfilesWithPluginsMock,
}));

/** Reused helper for begin Secrets Runtime Isolation For Test behavior in src/secrets. */
export function beginSecretsRuntimeIsolationForTest(): SecretsRuntimeEnvSnapshot {
  secretsRuntimePluginMocks.resolveExternalAuthProfilesWithPluginsMock.mockReset();
  secretsRuntimePluginMocks.resolveExternalAuthProfilesWithPluginsMock.mockReturnValue([]);
  secretsRuntimePluginMocks.resolvePluginWebSearchProvidersMock.mockReset();
  secretsRuntimePluginMocks.resolvePluginWebSearchProvidersMock.mockReturnValue([]);
  const envSnapshot = captureEnv([
    "OPENCLAW_BUNDLED_PLUGINS_DIR",
    "OPENCLAW_DISABLE_BUNDLED_PLUGINS",
    "OPENCLAW_VERSION",
  ]);
  delete process.env.OPENCLAW_BUNDLED_PLUGINS_DIR;
  delete process.env.OPENCLAW_VERSION;
  return envSnapshot;
}

/** Reused helper for end Secrets Runtime Isolation For Test behavior in src/secrets. */
export function endSecretsRuntimeIsolationForTest(envSnapshot: SecretsRuntimeEnvSnapshot) {
  vi.restoreAllMocks();
  envSnapshot.restore();
  clearSecretsRuntimeSnapshot();
  clearRuntimeConfigSnapshot();
  clearConfigCache();
}
