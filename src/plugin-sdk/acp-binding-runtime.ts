// Narrow ACP binding helpers for plugins that need persistent ACP setup state
// without importing the broad core SDK surface.

/** Re-exported API for src/plugin-sdk, starting with ensure Configured Acp Binding Ready. */
export { ensureConfiguredAcpBindingReady } from "../acp/persistent-bindings.lifecycle.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Configured Acp Binding Record. */
export { resolveConfiguredAcpBindingRecord } from "../acp/persistent-bindings.resolve.js";
