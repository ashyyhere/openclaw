// Narrow thread-binding lifecycle helpers for extensions that need binding
// expiry and session-binding record types without loading the full
// conversation-runtime surface.

/** Re-exported API for src/plugin-sdk, starting with resolve Thread Binding Conversation Id From Binding Id. */
export { resolveThreadBindingConversationIdFromBindingId } from "../channels/thread-binding-id.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Thread Binding Farewell Text. */
export { resolveThreadBindingFarewellText } from "../channels/thread-bindings-messages.js";
/** Re-exported API for src/plugin-sdk. */
export {
  resolveThreadBindingIdleTimeoutMsForChannel,
  resolveThreadBindingLifecycle,
  resolveThreadBindingMaxAgeMsForChannel,
} from "../channels/thread-bindings-policy.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  BindingTargetKind,
  SessionBindingAdapter,
  SessionBindingRecord,
} from "../infra/outbound/session-binding-service.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createAccountScopedConversationBindingManager,
  resetAccountScopedConversationBindingsForTests,
  type AccountScopedConversationBindingManager,
  type AccountScopedConversationBindingRecord,
} from "../infra/outbound/account-scoped-conversation-bindings.js";
/** Re-exported API for src/plugin-sdk. */
export {
  registerSessionBindingAdapter,
  unregisterSessionBindingAdapter,
} from "../infra/outbound/session-binding-service.js";
