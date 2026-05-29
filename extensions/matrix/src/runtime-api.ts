// extensions/matrix/src runtime api helpers and runtime behavior.
/** Re-exported matrix plugin public API. */
export {
  DEFAULT_ACCOUNT_ID,
  normalizeAccountId,
  normalizeOptionalAccountId,
} from "openclaw/plugin-sdk/account-id";
/** Re-exported matrix plugin public API. */
export {
  createActionGate,
  jsonResult,
  readNumberParam,
  readPositiveIntegerParam,
  readReactionParams,
  readStringArrayParam,
  readStringParam,
  ToolAuthorizationError,
} from "openclaw/plugin-sdk/channel-actions";
/** Re-exported matrix plugin public API, starting with build Channel Config Schema. */
export { buildChannelConfigSchema } from "openclaw/plugin-sdk/channel-config-primitives";
/** Re-exported matrix plugin public API, starting with Channel Plugin. */
export type { ChannelPlugin } from "openclaw/plugin-sdk/channel-core";
/** Re-exported matrix plugin public API. */
export type {
  BaseProbeResult,
  ChannelDirectoryEntry,
  ChannelGroupContext,
  ChannelMessageActionAdapter,
  ChannelMessageActionContext,
  ChannelMessageActionName,
  ChannelMessageToolDiscovery,
  ChannelOutboundAdapter,
  ChannelResolveKind,
  ChannelResolveResult,
  ChannelToolSend,
} from "openclaw/plugin-sdk/channel-contract";
/** Re-exported matrix plugin public API. */
export {
  formatLocationText,
  toLocationContext,
  type NormalizedLocation,
} from "openclaw/plugin-sdk/channel-inbound";
/** Re-exported matrix plugin public API, starting with log Inbound Drop. */
export { logInboundDrop } from "openclaw/plugin-sdk/channel-inbound";
/** Re-exported matrix plugin public API, starting with log Typing Failure. */
export { logTypingFailure } from "openclaw/plugin-sdk/channel-outbound";
/** Re-exported matrix plugin public API, starting with resolve Ack Reaction. */
export { resolveAckReaction } from "openclaw/plugin-sdk/channel-feedback";
/** Re-exported matrix plugin public API, starting with Channel Setup Input. */
export type { ChannelSetupInput } from "openclaw/plugin-sdk/setup";
/** Re-exported matrix plugin public API. */
export type {
  OpenClawConfig,
  ContextVisibilityMode,
  DmPolicy,
  GroupPolicy,
} from "openclaw/plugin-sdk/config-contracts";
/** Re-exported matrix plugin public API, starting with Group Tool Policy Config. */
export type { GroupToolPolicyConfig } from "openclaw/plugin-sdk/config-contracts";
/** Re-exported matrix plugin public API, starting with Wizard Prompter. */
export type { WizardPrompter } from "openclaw/plugin-sdk/setup";
/** Re-exported matrix plugin public API, starting with Secret Input. */
export type { SecretInput } from "openclaw/plugin-sdk/secret-input";
/** Re-exported matrix plugin public API. */
export {
  GROUP_POLICY_BLOCKED_LABEL,
  resolveAllowlistProviderRuntimeGroupPolicy,
  resolveDefaultGroupPolicy,
  warnMissingProviderGroupPolicyFallbackOnce,
} from "openclaw/plugin-sdk/runtime-group-policy";
/** Re-exported matrix plugin public API. */
export {
  addWildcardAllowFrom,
  formatDocsLink,
  hasConfiguredSecretInput,
  mergeAllowFromEntries,
  moveSingleAccountChannelSectionToDefaultAccount,
  promptAccountId,
  promptChannelAccessConfig,
  splitSetupEntries,
} from "openclaw/plugin-sdk/setup";
/** Re-exported matrix plugin public API, starting with Runtime Env. */
export type { RuntimeEnv } from "openclaw/plugin-sdk/runtime";
/** Re-exported matrix plugin public API. */
export {
  assertHttpUrlTargetsPrivateNetwork,
  closeDispatcher,
  createPinnedDispatcher,
  isPrivateOrLoopbackHost,
  resolvePinnedHostnameWithPolicy,
  ssrfPolicyFromDangerouslyAllowPrivateNetwork,
  ssrfPolicyFromAllowPrivateNetwork,
  type LookupFn,
  type SsrFPolicy,
} from "openclaw/plugin-sdk/ssrf-runtime";
/** Re-exported matrix plugin public API, starting with dispatch Reply From Config With Settled Dispatcher. */
export { dispatchReplyFromConfigWithSettledDispatcher } from "openclaw/plugin-sdk/channel-inbound";
/** Re-exported matrix plugin public API. */
export {
  ensureConfiguredAcpBindingReady,
  resolveConfiguredAcpBindingRecord,
} from "openclaw/plugin-sdk/acp-binding-runtime";
/** Re-exported matrix plugin public API. */
export {
  buildProbeChannelStatusSummary,
  collectStatusIssuesFromLastError,
  PAIRING_APPROVED_MESSAGE,
} from "openclaw/plugin-sdk/channel-status";
/** Re-exported matrix plugin public API. */
export {
  getSessionBindingService,
  resolveThreadBindingIdleTimeoutMsForChannel,
  resolveThreadBindingMaxAgeMsForChannel,
} from "openclaw/plugin-sdk/conversation-runtime";
/** Re-exported matrix plugin public API, starting with resolve Outbound Send Dep. */
export { resolveOutboundSendDep } from "openclaw/plugin-sdk/channel-outbound";
/** Re-exported matrix plugin public API, starting with resolve Agent Id From Session Key. */
export { resolveAgentIdFromSessionKey } from "openclaw/plugin-sdk/routing";
/** Re-exported matrix plugin public API, starting with chunk Text For Outbound. */
export { chunkTextForOutbound } from "openclaw/plugin-sdk/text-chunking";
/** Re-exported matrix plugin public API, starting with create Channel Message Reply Pipeline. */
export { createChannelMessageReplyPipeline } from "openclaw/plugin-sdk/channel-outbound";
/** Re-exported matrix plugin public API, starting with load Outbound Media From Url. */
export { loadOutboundMediaFromUrl } from "openclaw/plugin-sdk/outbound-media";
/** Re-exported matrix plugin public API, starting with normalize Poll Input. */
export { normalizePollInput, type PollInput } from "openclaw/plugin-sdk/poll-runtime";
/** Re-exported matrix plugin public API, starting with write Json File Atomically. */
export { writeJsonFileAtomically } from "openclaw/plugin-sdk/json-store";
/** Re-exported matrix plugin public API. */
export {
  buildChannelKeyCandidates,
  resolveChannelEntryMatch,
} from "openclaw/plugin-sdk/channel-targets";
/** Re-exported matrix plugin public API, starting with build Timeout Abort Signal. */
export { buildTimeoutAbortSignal } from "./matrix/sdk/timeout-abort-signal.js";
/** Re-exported matrix plugin public API, starting with format Zoned Timestamp. */
export { formatZonedTimestamp } from "openclaw/plugin-sdk/time-runtime";
/** Re-exported matrix plugin public API, starting with Plugin Runtime. */
export type { PluginRuntime, RuntimeLogger } from "openclaw/plugin-sdk/plugin-runtime";
/** Re-exported matrix plugin public API, starting with Reply Payload. */
export type { ReplyPayload } from "openclaw/plugin-sdk/reply-runtime";
// resolveMatrixAccountStringValues already comes from the Matrix API barrel.
// Re-exporting auth-precedence here makes TS source loaders define the export twice.
