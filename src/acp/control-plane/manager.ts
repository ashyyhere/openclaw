/** Singleton ACP session manager entrypoint and testing reset hooks. */
import { AcpSessionManager } from "./manager.core.js";

/** Re-exported API for src/acp/control-plane, starting with Acp Session Manager. */
export { AcpSessionManager } from "./manager.core.js";
/** Re-exported API for src/acp/control-plane. */
export type {
  AcpCloseSessionInput,
  AcpCloseSessionResult,
  AcpInitializeSessionInput,
  AcpManagerObservabilitySnapshot,
  AcpRunTurnInput,
  AcpSessionResolution,
  AcpSessionRuntimeOptions,
  AcpSessionStatus,
  AcpStartupIdentityReconcileResult,
} from "./manager.types.js";

let ACP_SESSION_MANAGER_SINGLETON: AcpSessionManager | null = null;

/** Return the process singleton ACP session manager. */
export function getAcpSessionManager(): AcpSessionManager {
  if (!ACP_SESSION_MANAGER_SINGLETON) {
    ACP_SESSION_MANAGER_SINGLETON = new AcpSessionManager();
  }
  return ACP_SESSION_MANAGER_SINGLETON;
}

/** Reused constant for testing behavior in src/acp/control-plane. */
export const testing = {
  resetAcpSessionManagerForTests() {
    ACP_SESSION_MANAGER_SINGLETON = null;
  },
  setAcpSessionManagerForTests(manager: unknown) {
    ACP_SESSION_MANAGER_SINGLETON = manager as AcpSessionManager | null;
  },
};
/** Re-exported API for src/acp/control-plane, starting with testing. */
export { testing as __testing };
