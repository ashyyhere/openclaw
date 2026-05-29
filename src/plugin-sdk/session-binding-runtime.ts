// Narrow session-binding runtime surface for channels that only need current
// conversation binding state, not configured binding routing or pairing stores.
/** Re-exported API for src/plugin-sdk. */
export {
  testing as __testing,
  testing,
  getSessionBindingService,
  registerSessionBindingAdapter,
  type SessionBindingRecord,
  type SessionBindingService,
} from "../infra/outbound/session-binding-service.js";
