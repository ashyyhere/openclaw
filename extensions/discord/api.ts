// extensions/discord api helpers and runtime behavior.
/** Re-exported discord plugin public API, starting with discord Plugin. */
export { discordPlugin } from "./src/channel.js";
/** Re-exported discord plugin public API, starting with discord Setup Plugin. */
export { discordSetupPlugin } from "./src/channel.setup.js";
/** Re-exported discord plugin public API. */
export {
  handleDiscordSubagentDeliveryTarget,
  handleDiscordSubagentEnded,
  handleDiscordSubagentSpawning,
} from "./src/subagent-hooks.js";
/** Re-exported discord plugin public API, starting with inspect Discord Account. */
export { inspectDiscordAccount, type InspectedDiscordAccount } from "./src/account-inspect.js";
/** Re-exported discord plugin public API, starting with type. */
export { type DiscordCredentialStatus } from "./src/token.js";
/** Re-exported discord plugin public API. */
export {
  createDiscordActionGate,
  listDiscordAccountIds,
  listEnabledDiscordAccounts,
  mergeDiscordAccountConfig,
  type ResolvedDiscordAccount,
  resolveDefaultDiscordAccountId,
  resolveDiscordAccount,
  resolveDiscordAccountConfig,
  resolveDiscordMaxLinesPerMessage,
} from "./src/accounts.js";
/** Re-exported discord plugin public API, starting with try Handle Discord Message Action Guild Admin. */
export { tryHandleDiscordMessageActionGuildAdmin } from "./src/actions/handle-action.guild-admin.js";
/** Re-exported discord plugin public API, starting with Discord Api Error. */
export { DiscordApiError, fetchDiscord, requestDiscord } from "./src/api.js";
/** Re-exported discord plugin public API, starting with build Discord Component Message. */
export { buildDiscordComponentMessage } from "./src/components.js";
type DiscordMessageActionHandler =
  typeof import("./src/channel-actions.runtime.js").handleDiscordMessageAction;

// Deprecated compatibility surface for existing @openclaw/discord/api.js consumers.
/** Public discord plugin constant for handle Discord Message Action behavior. */
export const handleDiscordMessageAction: DiscordMessageActionHandler = async (...args) =>
  (await import("./src/channel-actions.runtime.js")).handleDiscordMessageAction(...args);
/** Re-exported discord plugin public API. */
export {
  listDiscordDirectoryGroupsFromConfig,
  listDiscordDirectoryPeersFromConfig,
} from "./src/directory-config.js";
/** Re-exported discord plugin public API. */
export {
  resolveDiscordGroupRequireMention,
  resolveDiscordGroupToolPolicy,
} from "./src/group-policy.js";
/** Re-exported discord plugin public API. */
export {
  looksLikeDiscordTargetId,
  normalizeDiscordMessagingTarget,
  normalizeDiscordOutboundTarget,
} from "./src/normalize.js";
/** Re-exported discord plugin public API, starting with resolve Open Provider Runtime Group Policy. */
export { resolveOpenProviderRuntimeGroupPolicy as resolveDiscordRuntimeGroupPolicy } from "openclaw/plugin-sdk/runtime-group-policy";
/** Re-exported discord plugin public API, starting with collect Discord Status Issues. */
export { collectDiscordStatusIssues } from "./src/status-issues.js";

/** Re-exported discord plugin public API. */
export {
  buildDiscordComponentCustomId,
  buildDiscordComponentMessageFlags,
  buildDiscordInteractiveComponents,
  buildDiscordModalCustomId,
  createDiscordFormModal,
  DISCORD_COMPONENT_ATTACHMENT_PREFIX,
  DISCORD_COMPONENT_CUSTOM_ID_KEY,
  DISCORD_MODAL_CUSTOM_ID_KEY,
  DiscordFormModal,
  formatDiscordComponentEventText,
  parseDiscordComponentCustomId,
  parseDiscordComponentCustomIdForInteraction,
  parseDiscordComponentCustomIdForInteraction as parseDiscordComponentCustomIdForCarbon,
  parseDiscordModalCustomId,
  parseDiscordModalCustomIdForInteraction,
  parseDiscordModalCustomIdForInteraction as parseDiscordModalCustomIdForCarbon,
  readDiscordComponentSpec,
  resolveDiscordComponentAttachmentName,
  type ComponentData,
  type DiscordComponentBlock,
  type DiscordComponentBuildResult,
  type DiscordComponentButtonSpec,
  type DiscordComponentButtonStyle,
  type DiscordComponentEntry,
  type DiscordComponentMessageSpec,
  type DiscordComponentModalFieldType,
  type DiscordComponentSectionAccessory,
  type DiscordComponentSelectOption,
  type DiscordComponentSelectSpec,
  type DiscordComponentSelectType,
  type DiscordModalEntry,
  type DiscordModalFieldDefinition,
  type DiscordModalFieldSpec,
  type DiscordModalSpec,
} from "./src/components.js";
/** Re-exported discord plugin public API. */
export {
  getDiscordExecApprovalApprovers,
  isDiscordExecApprovalApprover,
  isDiscordExecApprovalClientEnabled,
  shouldSuppressLocalDiscordExecApprovalPrompt,
} from "./src/exec-approvals.js";
/** Re-exported discord plugin public API. */
export type {
  DiscordInteractiveHandlerContext,
  DiscordInteractiveHandlerRegistration,
} from "./src/interactive-dispatch.js";
/** Re-exported discord plugin public API. */
export {
  type DiscordPluralKitConfig,
  fetchPluralKitMessageInfo,
  type PluralKitMemberInfo,
  type PluralKitMessageInfo,
  type PluralKitSystemInfo,
} from "./src/pluralkit.js";
/** Re-exported discord plugin public API. */
export {
  fetchDiscordApplicationId,
  fetchDiscordApplicationSummary,
  parseApplicationIdFromToken,
  probeDiscord,
  resolveDiscordPrivilegedIntentsFromFlags,
  type DiscordApplicationSummary,
  type DiscordPrivilegedIntentsSummary,
  type DiscordPrivilegedIntentStatus,
  type DiscordProbe,
} from "./src/probe.js";
/** Re-exported discord plugin public API, starting with normalize Explicit Discord Session Key. */
export { normalizeExplicitDiscordSessionKey } from "./src/session-key-normalization.js";
/** Re-exported discord plugin public API, starting with parse Discord Send Target. */
export { parseDiscordSendTarget, type SendDiscordTarget } from "./src/send-target-parsing.js";
/** Re-exported discord plugin public API. */
export {
  parseDiscordTarget,
  resolveDiscordChannelId,
  resolveDiscordTarget,
  type DiscordTarget,
  type DiscordTargetKind,
  type DiscordTargetParseOptions,
} from "./src/targets.js";
/** Re-exported discord plugin public API, starting with collect Discord Security Audit Findings. */
export { collectDiscordSecurityAuditFindings } from "./src/security-audit.js";
/** Re-exported discord plugin public API. */
export {
  DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS,
  DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS,
  DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS,
  DISCORD_DEFAULT_LISTENER_TIMEOUT_MS,
  mergeAbortSignals,
} from "./src/monitor/timeouts.js";
/** Re-exported discord plugin public API, starting with Discord Send Components. */
export type { DiscordSendComponents, DiscordSendEmbeds } from "./src/send.shared.js";
/** Re-exported discord plugin public API, starting with Discord Send Result. */
export type { DiscordSendResult } from "./src/send.types.js";
/** Re-exported discord plugin public API, starting with Discord Token Resolution. */
export type { DiscordTokenResolution } from "./src/token.js";
