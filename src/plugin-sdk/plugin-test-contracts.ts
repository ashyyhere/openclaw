/** Public SDK barrel for reusable plugin/provider contract test helpers. */
export {
  assertNoImportTimeSideEffects,
  createPluginRegistryFixture,
  registerProviders,
  registerTestPlugin,
  registerVirtualTestPlugin,
  requireProvider,
  uniqueSortedStrings,
} from "./test-helpers/contracts-testkit.js";
/** Re-exported API for src/plugin-sdk, starting with run Direct Import Smoke. */
export { runDirectImportSmoke } from "./test-helpers/direct-smoke.js";
/** Re-exported API for src/plugin-sdk, starting with describe Package Manifest Contract. */
export { describePackageManifestContract } from "./test-helpers/package-manifest-contract.js";
/** Re-exported API for src/plugin-sdk, starting with plugin Registration Contract Cases. */
export { pluginRegistrationContractCases } from "./test-helpers/plugin-registration-contract-cases.js";
/** Re-exported API for src/plugin-sdk, starting with describe Plugin Registration Contract. */
export { describePluginRegistrationContract } from "./test-helpers/plugin-registration-contract.js";
/** Re-exported API for src/plugin-sdk. */
export {
  GUARDED_EXTENSION_PUBLIC_SURFACE_BASENAMES,
  BUNDLED_RUNTIME_SIDECAR_BASENAMES,
  getPublicArtifactBasename,
} from "./test-helpers/public-artifacts.js";
/** Re-exported API for src/plugin-sdk. */
export {
  loadBundledPluginPublicSurface,
  loadBundledPluginPublicSurfaceSync,
  resolveWorkspacePackagePublicModuleUrl,
} from "./test-helpers/public-surface-loader.js";
