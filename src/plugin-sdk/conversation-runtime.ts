/**
 * @deprecated Broad public SDK barrel. Prefer focused conversation/thread
 * binding subpaths and avoid adding new imports here.
 */

export {
  createConversationBindingRecord,
  getConversationBindingCapabilities,
  listSessionBindingRecords,
  resolveConversationBindingRecord,
  touchConversationBindingRecord,
  unbindConversationBindingRecord,
} from "../bindings/records.js";
/** Re-exported API for src/plugin-sdk. */
export {
  ensureConfiguredBindingRouteReady,
  resolveConfiguredBindingRoute,
  type ConfiguredBindingRouteResult,
  resolveRuntimeConversationBindingRoute,
  type RuntimeConversationBindingRouteResult,
} from "../channels/plugins/binding-routing.js";
/** Re-exported API for src/plugin-sdk. */
export {
  primeConfiguredBindingRegistry,
  resolveConfiguredBinding,
  resolveConfiguredBindingRecord,
  resolveConfiguredBindingRecordBySessionKey,
  resolveConfiguredBindingRecordForConversation,
} from "../channels/plugins/binding-registry.js";
/** Re-exported API for src/plugin-sdk. */
export {
  ensureConfiguredBindingTargetReady,
  ensureConfiguredBindingTargetSession,
  resetConfiguredBindingTargetInPlace,
} from "../channels/plugins/binding-targets.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Conversation Label. */
export { resolveConversationLabel } from "../channels/conversation-label.js";
/** Re-exported API for src/plugin-sdk, starting with record Inbound Session. */
export { recordInboundSession } from "../channels/session.js";
/** Re-exported API for src/plugin-sdk, starting with record Inbound Session Meta Safe. */
export { recordInboundSessionMetaSafe } from "../channels/session-meta.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Thread Binding Conversation Id From Binding Id. */
export { resolveThreadBindingConversationIdFromBindingId } from "../channels/thread-binding-id.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createScopedAccountReplyToModeResolver,
  createStaticReplyToModeResolver,
  createTopLevelChannelReplyToModeResolver,
} from "../channels/plugins/threading-helpers.js";
/** Re-exported API for src/plugin-sdk. */
export {
  formatThreadBindingDurationLabel,
  resolveThreadBindingFarewellText,
  resolveThreadBindingIntroText,
  resolveThreadBindingThreadName,
} from "../channels/thread-bindings-messages.js";
/** Re-exported API for src/plugin-sdk. */
export {
  formatThreadBindingDisabledError,
  formatThreadBindingSpawnDisabledError,
  resolveThreadBindingEffectiveExpiresAt,
  resolveThreadBindingIdleTimeoutMs,
  resolveThreadBindingIdleTimeoutMsForChannel,
  resolveThreadBindingLifecycle,
  resolveThreadBindingMaxAgeMs,
  resolveThreadBindingMaxAgeMsForChannel,
  resolveThreadBindingsEnabled,
  resolveThreadBindingSpawnPolicy,
  type ThreadBindingSpawnKind,
  type ThreadBindingSpawnPolicy,
} from "../channels/thread-bindings-policy.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  ConfiguredBindingConversation,
  ConfiguredBindingResolution,
  CompiledConfiguredBinding,
  StatefulBindingTargetDescriptor,
} from "../channels/plugins/binding-types.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  StatefulBindingTargetDriver,
  StatefulBindingTargetReadyResult,
  StatefulBindingTargetResetResult,
  StatefulBindingTargetSessionResult,
} from "../channels/plugins/stateful-target-drivers.js";
/** Re-exported API for src/plugin-sdk. */
export {
  type BindingStatus,
  type BindingTargetKind,
  type ConversationRef,
  SessionBindingError,
  type SessionBindingAdapter,
  type SessionBindingAdapterCapabilities,
  type SessionBindingBindInput,
  type SessionBindingCapabilities,
  type SessionBindingPlacement,
  type SessionBindingRecord,
  type SessionBindingService,
  type SessionBindingUnbindInput,
  getSessionBindingService,
  isSessionBindingError,
  registerSessionBindingAdapter,
  unregisterSessionBindingAdapter,
} from "../infra/outbound/session-binding-service.js";
/** Re-exported API for src/plugin-sdk, starting with testing. */
export { testing, testing as __testing } from "../infra/outbound/session-binding-service.js";
export * from "../pairing/pairing-challenge.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Pairing Id Label. */
export { resolvePairingIdLabel } from "../pairing/pairing-labels.js";
export * from "../pairing/pairing-messages.js";
export * from "../pairing/pairing-store.js";
/** Re-exported API for src/plugin-sdk. */
export {
  buildPluginBindingApprovalCustomId,
  buildPluginBindingDeclinedText,
  buildPluginBindingErrorText,
  buildPluginBindingResolvedText,
  buildPluginBindingUnavailableText,
  detachPluginConversationBinding,
  getCurrentPluginConversationBinding,
  hasShownPluginBindingFallbackNotice,
  isPluginOwnedBindingMetadata,
  isPluginOwnedSessionBindingRecord,
  markPluginBindingFallbackNoticeShown,
  parsePluginBindingApprovalCustomId,
  requestPluginConversationBinding,
  resolvePluginConversationBindingApproval,
  toPluginConversationBinding,
} from "../plugins/conversation-binding.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Pinned Main Dm Owner From Allowlist. */
export { resolvePinnedMainDmOwnerFromAllowlist } from "./channel-access-compat.js";
