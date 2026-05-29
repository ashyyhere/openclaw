// gateway events helpers and runtime behavior.
import type { UpdateAvailable } from "../infra/update-startup.js";

/** Reused constant for GATEWAY EVENT UPDATE AVAILABLE behavior in src/gateway. */
export const GATEWAY_EVENT_UPDATE_AVAILABLE = "update.available" as const;

/** Shared type for Gateway Update Available Event Payload in src/gateway. */
export type GatewayUpdateAvailableEventPayload = {
  updateAvailable: UpdateAvailable | null;
};
