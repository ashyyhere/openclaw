// Public ACP runtime helpers for plugins that integrate with ACP control/session state.

import { testing as managerTesting, getAcpSessionManager } from "../acp/control-plane/manager.js";
import { testing as registryTesting } from "../acp/runtime/registry.js";

/** Shared ACP session manager for plugin runtime control-plane integrations. */
export { getAcpSessionManager };
/** ACP runtime error class and guard used across backend adapters. */
export { AcpRuntimeError, isAcpRuntimeError } from "../acp/runtime/errors.js";
/** Stable ACP runtime error codes surfaced by backend adapters. */
export type { AcpRuntimeErrorCode } from "../acp/runtime/errors.js";
/** Register and resolve ACP runtime backends by runtime id. */
export {
  getAcpRuntimeBackend,
  registerAcpRuntimeBackend,
  requireAcpRuntimeBackend,
  unregisterAcpRuntimeBackend,
} from "../acp/runtime/registry.js";
/** ACP backend, session, turn, attachment, and status contracts for plugins. */
export type {
  AcpRuntime,
  AcpRuntimeCapabilities,
  AcpRuntimeDoctorReport,
  AcpRuntimeEnsureInput,
  AcpRuntimeEvent,
  AcpRuntimeHandle,
  AcpRuntimeStatus,
  AcpRuntimeTurn,
  AcpRuntimeTurnAttachment,
  AcpRuntimeTurnInput,
  AcpRuntimeTurnResult,
  AcpRuntimeTurnResultError,
  AcpSessionUpdateTag,
} from "../acp/runtime/types.js";
/** Read persisted ACP session metadata entries. */
export { readAcpSessionEntry } from "../acp/runtime/session-meta.js";
/** Stored ACP session metadata shape. */
export type { AcpSessionStoreEntry } from "../acp/runtime/session-meta.js";
/** Dispatch ACP reply hooks when a runtime turn produces output. */
export { tryDispatchAcpReplyHook } from "./acp-runtime-backend.js";

// Keep test helpers off the hot init path. Eagerly merging them here can
// create a back-edge through the bundled ACP runtime chunk before the imported
// testing bindings finish initialization.
/** Lazy testing facade that avoids ACP runtime initialization back-edges. */
export const testing = new Proxy({} as typeof managerTesting & typeof registryTesting, {
  get(_target, prop, receiver) {
    if (Reflect.has(managerTesting, prop)) {
      return Reflect.get(managerTesting, prop, receiver);
    }
    return Reflect.get(registryTesting, prop, receiver);
  },
  has(_target, prop) {
    return Reflect.has(managerTesting, prop) || Reflect.has(registryTesting, prop);
  },
  ownKeys() {
    return Array.from(
      new Set([...Reflect.ownKeys(managerTesting), ...Reflect.ownKeys(registryTesting)]),
    );
  },
  getOwnPropertyDescriptor(_target, prop) {
    if (Reflect.has(managerTesting, prop) || Reflect.has(registryTesting, prop)) {
      return {
        configurable: true,
        enumerable: true,
      };
    }
    return undefined;
  },
});

/** @deprecated Use `testing`. */
export { testing as __testing };
