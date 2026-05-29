// Focused public test helpers for plugin runtime, registry, and setup fixtures.

/** Re-exported API for src/plugin-sdk, starting with set Default Channel Plugin Registry For Tests. */
export { setDefaultChannelPluginRegistryForTests } from "../commands/channel-test-registry.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createEmptyPluginRegistry,
  createPluginRegistry,
  type PluginRecord,
} from "../plugins/registry.js";
/** Re-exported API for src/plugin-sdk. */
export {
  providerContractLoadError,
  pluginRegistrationContractRegistry,
  resolveProviderContractProvidersForPluginIds,
  resolveWebFetchProviderContractEntriesForPluginId,
  resolveWebSearchProviderContractEntriesForPluginId,
} from "../plugins/contracts/registry.js";
/** Re-exported API for src/plugin-sdk, starting with load Plugin Manifest Registry. */
export { loadPluginManifestRegistry } from "../plugins/manifest-registry.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Bundled Explicit Provider Contracts From Public Artifacts. */
export { resolveBundledExplicitProviderContractsFromPublicArtifacts } from "../plugins/provider-contract-public-artifacts.js";
/** Re-exported API for src/plugin-sdk. */
export {
  initializeGlobalHookRunner,
  resetGlobalHookRunner,
} from "../plugins/hook-runner-global.js";
/** Re-exported API for src/plugin-sdk, starting with add Test Hook. */
export { addTestHook } from "../plugins/hooks.test-helpers.js";
/** Re-exported API for src/plugin-sdk, starting with create Plugin Record. */
export { createPluginRecord } from "../plugins/status.test-helpers.js";
/** Re-exported API for src/plugin-sdk. */
export {
  resolveBundledExplicitWebFetchProvidersFromPublicArtifacts,
  resolveBundledExplicitWebSearchProvidersFromPublicArtifacts,
} from "../plugins/web-provider-public-artifacts.explicit.js";
/** Re-exported API for src/plugin-sdk. */
export {
  getActivePluginRegistry,
  releasePinnedPluginChannelRegistry,
  resetPluginRuntimeStateForTest,
  setActivePluginRegistry,
} from "../plugins/runtime.js";
/** Re-exported API for src/plugin-sdk. */
export {
  listImportedBundledPluginFacadeIds,
  resetFacadeRuntimeStateForTest,
} from "./facade-runtime.js";
/** Re-exported API for src/plugin-sdk, starting with capture Plugin Registration. */
export { capturePluginRegistration } from "../plugins/captured-registration.js";
/** Re-exported API for src/plugin-sdk, starting with clear Health Checks For Test. */
export { clearHealthChecksForTest } from "../flows/health-check-registry.js";
/** Re-exported API for src/plugin-sdk, starting with run Provider Catalog. */
export { runProviderCatalog } from "../plugins/provider-discovery.js";
/** Re-exported API for src/plugin-sdk, starting with on Trusted Internal Diagnostic Event. */
export { onTrustedInternalDiagnosticEvent } from "../infra/diagnostic-events.js";
/** Re-exported API for src/plugin-sdk. */
export {
  buildProviderPluginMethodChoice,
  resolveProviderModelPickerEntries,
  resolveProviderWizardOptions,
  setProviderWizardProvidersResolverForTest,
} from "../plugins/provider-wizard.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Provider Plugin Choice. */
export { resolveProviderPluginChoice } from "../plugins/provider-auth-choice.runtime.js";
/** Re-exported API for src/plugin-sdk. */
export {
  clearEmbeddingProviders,
  getRegisteredEmbeddingProvider,
  listRegisteredEmbeddingProviders,
  registerEmbeddingProvider,
  restoreRegisteredEmbeddingProviders,
  type RegisteredEmbeddingProvider,
} from "../plugins/embedding-providers.js";
/** Re-exported API for src/plugin-sdk. */
export {
  clearMemoryEmbeddingProviders,
  listRegisteredMemoryEmbeddingProviders,
  restoreRegisteredMemoryEmbeddingProviders,
  type RegisteredMemoryEmbeddingProvider,
} from "../plugins/memory-embedding-providers.js";
/** Re-exported API for src/plugin-sdk, starting with Plugin Runtime. */
export type { PluginRuntime } from "../plugins/runtime/types.js";
/** Re-exported API for src/plugin-sdk, starting with Plugin Hook Registration. */
export type { PluginHookRegistration } from "../plugins/hook-types.js";
/** Re-exported API for src/plugin-sdk, starting with Runtime Env. */
export type { RuntimeEnv } from "../runtime.js";
/** Re-exported API for src/plugin-sdk, starting with Mock Fn. */
export type { MockFn } from "../test-utils/vitest-mock-fn.js";
/** Re-exported API for src/plugin-sdk, starting with create Outbound Test Plugin. */
export { createOutboundTestPlugin, createTestRegistry } from "../test-utils/channel-plugins.js";
/** Re-exported API for src/plugin-sdk. */
export {
  registerProviderPlugin,
  registerProviderPlugins,
  registerSingleProviderPlugin,
  requireRegisteredProvider,
  type RegisteredProviderCollections,
} from "../test-utils/plugin-registration.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createNonExitingRuntimeEnv,
  createNonExitingTypedRuntimeEnv,
  createRuntimeEnv,
  createTypedRuntimeEnv,
} from "../test-utils/plugin-runtime-env.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createPluginSetupWizardAdapter,
  createPluginSetupWizardConfigure,
  createPluginSetupWizardStatus,
  createQueuedWizardPrompter,
  createSetupWizardAdapter,
  createTestWizardPrompter,
  promptSetupWizardAllowFrom,
  resolveSetupWizardAllowFromEntries,
  resolveSetupWizardGroupAllowlist,
  runSetupWizardConfigure,
  runSetupWizardFinalize,
  runSetupWizardPrepare,
  selectFirstWizardOption,
  type WizardPrompter,
} from "../test-utils/plugin-setup-wizard.js";
/** Re-exported API for src/plugin-sdk, starting with create Mock Plugin Registry. */
export { createMockPluginRegistry } from "../plugins/hooks.test-helpers.js";
/** Re-exported API for src/plugin-sdk, starting with build Plugin Api. */
export { buildPluginApi } from "../plugins/api-builder.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createCapturedPluginRegistration,
  type CapturedPluginRegistration,
} from "../plugins/captured-registration.js";
/** Re-exported API for src/plugin-sdk, starting with create Runtime Task Flow. */
export { createRuntimeTaskFlow } from "../plugins/runtime/runtime-taskflow.js";
