// Focused public test helpers for plugin runtime, registry, and setup fixtures.

/** Installs a default channel plugin registry for channel-focused tests. */
export { setDefaultChannelPluginRegistryForTests } from "../commands/channel-test-registry.js";
/** Plugin registry constructors and record type for tests. */
export {
  createEmptyPluginRegistry,
  createPluginRegistry,
  type PluginRecord,
} from "../plugins/registry.js";
/** Provider and web contract registry helpers for plugin tests. */
export {
  providerContractLoadError,
  pluginRegistrationContractRegistry,
  resolveProviderContractProvidersForPluginIds,
  resolveWebFetchProviderContractEntriesForPluginId,
  resolveWebSearchProviderContractEntriesForPluginId,
} from "../plugins/contracts/registry.js";
/** Loads plugin manifests for test registry setup. */
export { loadPluginManifestRegistry } from "../plugins/manifest-registry.js";
/** Resolves bundled provider contracts from public artifacts for tests. */
export { resolveBundledExplicitProviderContractsFromPublicArtifacts } from "../plugins/provider-contract-public-artifacts.js";
/** Global hook runner lifecycle helpers for plugin tests. */
export {
  initializeGlobalHookRunner,
  resetGlobalHookRunner,
} from "../plugins/hook-runner-global.js";
/** Registers an in-memory hook for plugin tests. */
export { addTestHook } from "../plugins/hooks.test-helpers.js";
/** Creates plugin status records for tests. */
export { createPluginRecord } from "../plugins/status.test-helpers.js";
/** Resolves bundled web provider public artifacts for tests. */
export {
  resolveBundledExplicitWebFetchProvidersFromPublicArtifacts,
  resolveBundledExplicitWebSearchProvidersFromPublicArtifacts,
} from "../plugins/web-provider-public-artifacts.explicit.js";
/** Active plugin runtime registry controls for tests. */
export {
  getActivePluginRegistry,
  releasePinnedPluginChannelRegistry,
  resetPluginRuntimeStateForTest,
  setActivePluginRegistry,
} from "../plugins/runtime.js";
/** Facade runtime inspection and reset helpers for tests. */
export {
  listImportedBundledPluginFacadeIds,
  resetFacadeRuntimeStateForTest,
} from "./facade-runtime.js";
/** Captures plugin registration side effects for assertions. */
export { capturePluginRegistration } from "../plugins/captured-registration.js";
/** Clears registered health checks between tests. */
export { clearHealthChecksForTest } from "../flows/health-check-registry.js";
/** Runs provider catalog discovery in tests. */
export { runProviderCatalog } from "../plugins/provider-discovery.js";
/** Subscribes tests to trusted internal diagnostic events. */
export { onTrustedInternalDiagnosticEvent } from "../infra/diagnostic-events.js";
/** Provider setup wizard choice helpers and test resolver injection. */
export {
  buildProviderPluginMethodChoice,
  resolveProviderModelPickerEntries,
  resolveProviderWizardOptions,
  setProviderWizardProvidersResolverForTest,
} from "../plugins/provider-wizard.js";
/** Resolves provider plugin auth choices through the runtime helper. */
export { resolveProviderPluginChoice } from "../plugins/provider-auth-choice.runtime.js";
/** Embedding provider registry helpers for tests. */
export {
  clearEmbeddingProviders,
  getRegisteredEmbeddingProvider,
  listRegisteredEmbeddingProviders,
  registerEmbeddingProvider,
  restoreRegisteredEmbeddingProviders,
  type RegisteredEmbeddingProvider,
} from "../plugins/embedding-providers.js";
/** Memory embedding provider registry helpers for tests. */
export {
  clearMemoryEmbeddingProviders,
  listRegisteredMemoryEmbeddingProviders,
  restoreRegisteredMemoryEmbeddingProviders,
  type RegisteredMemoryEmbeddingProvider,
} from "../plugins/memory-embedding-providers.js";
/** Plugin runtime type used by test fixtures. */
export type { PluginRuntime } from "../plugins/runtime/types.js";
/** Plugin hook registration type used by test fixtures. */
export type { PluginHookRegistration } from "../plugins/hook-types.js";
/** Runtime environment type used by plugin tests. */
export type { RuntimeEnv } from "../runtime.js";
/** Mock function type shared by plugin test helpers. */
export type { MockFn } from "../test-utils/vitest-mock-fn.js";
/** Channel plugin test fixture factories. */
export { createOutboundTestPlugin, createTestRegistry } from "../test-utils/channel-plugins.js";
/** Provider plugin registration helpers for tests. */
export {
  registerProviderPlugin,
  registerProviderPlugins,
  registerSingleProviderPlugin,
  requireRegisteredProvider,
  type RegisteredProviderCollections,
} from "../test-utils/plugin-registration.js";
/** RuntimeEnv factories that avoid process exits during tests. */
export {
  createNonExitingRuntimeEnv,
  createNonExitingTypedRuntimeEnv,
  createRuntimeEnv,
  createTypedRuntimeEnv,
} from "../test-utils/plugin-runtime-env.js";
/** Plugin setup wizard test adapters, prompters, and runners. */
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
/** Creates a mock plugin registry for hook tests. */
export { createMockPluginRegistry } from "../plugins/hooks.test-helpers.js";
/** Builds a plugin API facade for tests. */
export { buildPluginApi } from "../plugins/api-builder.js";
/** Captured plugin registration fixture helpers. */
export {
  createCapturedPluginRegistration,
  type CapturedPluginRegistration,
} from "../plugins/captured-registration.js";
/** Creates runtime task-flow fixtures for plugin runtime tests. */
export { createRuntimeTaskFlow } from "../plugins/runtime/runtime-taskflow.js";
