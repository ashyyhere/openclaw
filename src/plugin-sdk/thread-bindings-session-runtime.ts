/** Runtime SDK barrel for thread binding session farewell helpers. */
export { resolveThreadBindingFarewellText } from "../channels/thread-bindings-messages.js";
/** Re-exported API for src/plugin-sdk. */
export {
  resolveThreadBindingLifecycle,
  type ThreadBindingLifecycleRecord,
} from "../shared/thread-binding-lifecycle.js";
/** Re-exported API for src/plugin-sdk. */
export {
  registerSessionBindingAdapter,
  unregisterSessionBindingAdapter,
  type BindingTargetKind,
  type SessionBindingAdapter,
  type SessionBindingRecord,
} from "../infra/outbound/session-binding-service.js";
