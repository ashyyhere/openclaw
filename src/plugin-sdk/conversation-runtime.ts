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
/** Binding route resolvers that ensure configured conversation targets are ready. */
export {
  ensureConfiguredBindingRouteReady,
  resolveConfiguredBindingRoute,
  type ConfiguredBindingRouteResult,
  resolveRuntimeConversationBindingRoute,
  type RuntimeConversationBindingRouteResult,
} from "../channels/plugins/binding-routing.js";
/** Configured binding registry helpers for resolving records by session or conversation. */
export {
  primeConfiguredBindingRegistry,
  resolveConfiguredBinding,
  resolveConfiguredBindingRecord,
  resolveConfiguredBindingRecordBySessionKey,
  resolveConfiguredBindingRecordForConversation,
} from "../channels/plugins/binding-registry.js";
/** Target lifecycle helpers for prepared configured bindings. */
export {
  ensureConfiguredBindingTargetReady,
  ensureConfiguredBindingTargetSession,
  resetConfiguredBindingTargetInPlace,
} from "../channels/plugins/binding-targets.js";
/** Resolves a stable display label for a conversation reference. */
export { resolveConversationLabel } from "../channels/conversation-label.js";
/** Records inbound channel sessions for later binding resolution. */
export { recordInboundSession } from "../channels/session.js";
/** Safely records optional inbound session metadata. */
export { recordInboundSessionMetaSafe } from "../channels/session-meta.js";
/** Converts persisted thread binding ids back to conversation ids. */
export { resolveThreadBindingConversationIdFromBindingId } from "../channels/thread-binding-id.js";
/** Reply-to mode resolvers shared by threaded channel integrations. */
export {
  createScopedAccountReplyToModeResolver,
  createStaticReplyToModeResolver,
  createTopLevelChannelReplyToModeResolver,
} from "../channels/plugins/threading-helpers.js";
/** Thread binding message text and label formatters. */
export {
  formatThreadBindingDurationLabel,
  resolveThreadBindingFarewellText,
  resolveThreadBindingIntroText,
  resolveThreadBindingThreadName,
} from "../channels/thread-bindings-messages.js";
/** Thread binding policy resolvers for enablement, spawn, expiry, and errors. */
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
/** Configured binding descriptor and resolution types. */
export type {
  ConfiguredBindingConversation,
  ConfiguredBindingResolution,
  CompiledConfiguredBinding,
  StatefulBindingTargetDescriptor,
} from "../channels/plugins/binding-types.js";
/** Stateful target driver contracts for binding-capable channels. */
export type {
  StatefulBindingTargetDriver,
  StatefulBindingTargetReadyResult,
  StatefulBindingTargetResetResult,
  StatefulBindingTargetSessionResult,
} from "../channels/plugins/stateful-target-drivers.js";
/** Session binding service API used by channel plugins and runtime glue. */
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
/** Session binding test hooks retained for existing SDK consumers. */
export { testing, testing as __testing } from "../infra/outbound/session-binding-service.js";
export * from "../pairing/pairing-challenge.js";
/** Formats pairing ids for display in binding and setup flows. */
export { resolvePairingIdLabel } from "../pairing/pairing-labels.js";
export * from "../pairing/pairing-messages.js";
export * from "../pairing/pairing-store.js";
/** Plugin-owned conversation binding request, approval, and metadata helpers. */
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
/** Resolves the pinned main-DM owner for allowlist compatibility callers. */
export { resolvePinnedMainDmOwnerFromAllowlist } from "./channel-access-compat.js";
