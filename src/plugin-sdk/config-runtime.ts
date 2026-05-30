/**
 * @deprecated Public SDK subpath has no bundled extension production imports.
 * Prefer narrower config subpaths such as plugin-config-runtime,
 * config-mutation, and runtime-config-snapshot.
 */

import { loadSessionStore as loadSessionStoreImpl } from "../config/sessions/store-load.js";

/**
 * @deprecated Use getSessionEntry/listSessionEntries for reads and
 * patchSessionEntry/upsertSessionEntry for writes. loadSessionStore keeps the
 * legacy mutable whole-store shape and will remain a compatibility escape hatch.
 */
export const loadSessionStore = loadSessionStoreImpl;

/** Resolves the default agent id from runtime config. */
export { resolveDefaultAgentId } from "../agents/agent-scope.js";
/** Runtime plugin config accessors for the active host config snapshot. */
export {
  requireRuntimeConfig,
  resolveLivePluginConfigObject,
  resolvePluginConfigObject,
} from "./plugin-config-runtime.js";
/** Runtime config snapshot/cache helpers kept for compatibility. */
export {
  clearConfigCache,
  clearRuntimeConfigSnapshot,
  getRuntimeConfigSourceSnapshot,
  getRuntimeConfigSnapshot,
  getRuntimeConfig,
  /**
   * @deprecated Use getRuntimeConfig(), runtime.config.current(), or pass the
   * already loaded config through the call path. Runtime code must not reload
   * config on demand. Bundled plugins and repo code are blocked from using
   * this by the deprecated-internal-config-api architecture guard.
   */
  loadConfig,
  readConfigFileSnapshotForWrite,
  setRuntimeConfigSnapshot,
  /**
   * @deprecated Use mutateConfigFile() or replaceConfigFile() with an explicit
   * afterWrite intent so restart behavior stays under host control. Bundled
   * plugins and repo code are blocked from using this by the
   * deprecated-internal-config-api architecture guard.
   */
  writeConfigFile,
} from "../config/io.js";
/** Explicit config mutation helpers with host-controlled write intent. */
export { mutateConfigFile, replaceConfigFile } from "../config/mutate.js";
/** Config write after-write behavior type. */
export type { ConfigWriteAfterWrite } from "../config/runtime-snapshot.js";
/** Logs config update summaries through the host logger. */
export { logConfigUpdated } from "../config/logging.js";
/** Legacy command helper for applying model config updates. */
export { updateConfig } from "../commands/models/shared.js";
/** Resolves channel-level model overrides from config. */
export { resolveChannelModelOverride } from "../channels/model-overrides.js";
/** Supplemental context visibility evaluation helpers. */
export {
  evaluateSupplementalContextVisibility,
  filterSupplementalContextItems,
} from "../security/context-visibility.js";
/** Channel context visibility config resolvers. */
export {
  resolveChannelContextVisibilityMode,
  resolveDefaultContextVisibility,
} from "../config/context-visibility.js";
/** Resolves markdown table rendering mode from config. */
export { resolveMarkdownTableMode } from "../config/markdown-tables.js";
/** Group policy and per-sender tool policy resolvers. */
export {
  resolveChannelGroupPolicy,
  resolveChannelGroupRequireMention,
  resolveToolsBySender,
  type ChannelGroupPolicy,
} from "../config/group-policy.js";
/** Runtime group policy helpers for provider/channel execution. */
export {
  GROUP_POLICY_BLOCKED_LABEL,
  resolveAllowlistProviderRuntimeGroupPolicy,
  resolveDefaultGroupPolicy,
  resolveOpenProviderRuntimeGroupPolicy,
  warnMissingProviderGroupPolicyFallbackOnce,
} from "../config/runtime-group-policy.js";
/** Native command and native skill enablement resolvers. */
export {
  isNativeCommandsExplicitlyDisabled,
  resolveNativeCommandsEnabled,
  resolveNativeSkillsEnabled,
} from "../config/commands.js";
/** Telegram custom command normalization and resolution helpers. */
export {
  TELEGRAM_COMMAND_NAME_PATTERN,
  normalizeTelegramCommandName,
  resolveTelegramCustomCommands,
} from "./telegram-command-config.js";
/** Resolves the active Talk provider config. */
export { resolveActiveTalkProviderConfig } from "../config/talk.js";
/** Resolves the configured agent concurrency limit. */
export { resolveAgentMaxConcurrent } from "../config/agent-limits.js";
/** Cron store load/path/save helpers kept for compatibility. */
export { loadCronStore, resolveCronStorePath, saveCronStore } from "../cron/store.js";
/** Applies a model override to a persisted session entry. */
export { applyModelOverrideToSessionEntry } from "../sessions/model-overrides.js";
/** Coerces secret input values into SecretRef shape when possible. */
export { coerceSecretRef } from "../config/types.secrets.js";
/** Resolves configured SecretInput values for gateway-facing runtime code. */
export {
  resolveConfiguredSecretInputString,
  resolveConfiguredSecretInputWithFallback,
  resolveRequiredConfiguredSecretRefInputString,
} from "../gateway/resolve-configured-secret-input-string.js";
/** Legacy config type exports kept on the broad config-runtime facade. */
export type {
  BlockStreamingCoalesceConfig,
  DiscordAccountConfig,
  DiscordActionConfig,
  DiscordAutoPresenceConfig,
  DiscordConfig,
  DiscordExecApprovalConfig,
  DiscordGuildChannelConfig,
  DiscordGuildEntry,
  DiscordIntentsConfig,
  DiscordSlashCommandConfig,
  DmConfig,
  DmPolicy,
  GoogleChatAccountConfig,
  GoogleChatConfig,
  ContextVisibilityMode,
  GroupPolicy,
  GroupToolPolicyBySenderConfig,
  GroupToolPolicyConfig,
  MarkdownConfig,
  MarkdownTableMode,
  MSTeamsChannelConfig,
  MSTeamsConfig,
  MSTeamsReplyStyle,
  MSTeamsTeamConfig,
  OpenClawConfig,
  ReplyToMode,
  SignalReactionNotificationMode,
  SlackAccountConfig,
  SlackChannelConfig,
  SlackReactionNotificationMode,
  SlackSlashCommandConfig,
  TelegramAccountConfig,
  TelegramActionConfig,
  TelegramDirectConfig,
  TelegramExecApprovalConfig,
  TelegramGroupConfig,
  TelegramInlineButtonsScope,
  TelegramNetworkConfig,
  TelegramTopicConfig,
  ResolvedTtsPersona,
  TtsAutoMode,
  TtsConfig,
  TtsMode,
  TtsModelOverrideConfig,
  TtsPersonaConfig,
  TtsPersonaFallbackPolicy,
  TtsPersonaPromptConfig,
  TtsProvider,
} from "../config/types.js";
/** Session store read/write/update helpers kept for compatibility. */
export {
  clearSessionStoreCacheForTest,
  getSessionEntry,
  listSessionEntries,
  patchSessionEntry,
  readSessionUpdatedAt,
  recordSessionMetaFromInbound,
  saveSessionStore,
  updateLastRoute,
  updateSessionStore,
  updateSessionStoreEntry,
  upsertSessionEntry,
  resolveSessionStoreEntry,
} from "../config/sessions/store.js";
/** Resolves a session key from channel/session config inputs. */
export { resolveSessionKey } from "../config/sessions/session-key.js";
/** Resolves the persisted session store path. */
export { resolveStorePath } from "../config/sessions/paths.js";
/** Session reset mode type. */
export type { SessionResetMode } from "../config/sessions/reset.js";
/** Session key scope type. */
export type { SessionScope } from "../config/sessions/types.js";
/** Resolves group chat identity into a stable session key. */
export { resolveGroupSessionKey } from "../config/sessions/group.js";
/** Canonicalizes aliases that point at the main session. */
export { canonicalizeMainSessionAlias } from "../config/sessions/main-session.js";
/** Session reset policy and freshness evaluators. */
export {
  evaluateSessionFreshness,
  resolveChannelResetConfig,
  resolveSessionResetPolicy,
  resolveSessionResetType,
  resolveThreadFlag,
} from "../config/sessions/reset.js";
/** Dangerous display-name matching config guards. */
export {
  isDangerousNameMatchingEnabled,
  resolveDangerousNameMatchingEnabled,
} from "../config/dangerous-name-matching.js";
