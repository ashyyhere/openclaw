// Public ACP runtime helpers for plugins that integrate with ACP control/session state.

import { testing as managerTesting, getAcpSessionManager } from "../acp/control-plane/manager.js";
import { testing as registryTesting } from "../acp/runtime/registry.js";

/** Re-exported API for src/plugin-sdk, starting with get Acp Session Manager. */
export { getAcpSessionManager };
/** Re-exported API for src/plugin-sdk, starting with Acp Runtime Error. */
export { AcpRuntimeError, isAcpRuntimeError } from "../acp/runtime/errors.js";
/** Re-exported API for src/plugin-sdk, starting with Acp Runtime Error Code. */
export type { AcpRuntimeErrorCode } from "../acp/runtime/errors.js";
/** Re-exported API for src/plugin-sdk. */
export {
  getAcpRuntimeBackend,
  registerAcpRuntimeBackend,
  requireAcpRuntimeBackend,
  unregisterAcpRuntimeBackend,
} from "../acp/runtime/registry.js";
/** Re-exported API for src/plugin-sdk. */
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
/** Re-exported API for src/plugin-sdk, starting with read Acp Session Entry. */
export { readAcpSessionEntry } from "../acp/runtime/session-meta.js";
/** Re-exported API for src/plugin-sdk, starting with Acp Session Store Entry. */
export type { AcpSessionStoreEntry } from "../acp/runtime/session-meta.js";
/** Re-exported API for src/plugin-sdk, starting with try Dispatch Acp Reply Hook. */
export { tryDispatchAcpReplyHook } from "./acp-runtime-backend.js";

// Keep test helpers off the hot init path. Eagerly merging them here can
// create a back-edge through the bundled ACP runtime chunk before the imported
// testing bindings finish initialization.
/** Reused constant for testing behavior in src/plugin-sdk. */
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
