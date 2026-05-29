// Narrow shared secret-ref helpers for plugin config and secret-contract paths.

/** Re-exported API for src/plugin-sdk, starting with coerce Secret Ref. */
export { coerceSecretRef } from "../config/types.secrets.js";
/** Re-exported API for src/plugin-sdk, starting with Secret Input. */
export type { SecretInput, SecretRef } from "../config/types.secrets.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Secret Ref Values. */
export { resolveSecretRefValues } from "../secrets/resolve.js";
/** Re-exported API for src/plugin-sdk, starting with apply Resolved Assignments. */
export { applyResolvedAssignments, createResolverContext } from "../secrets/runtime-shared.js";
