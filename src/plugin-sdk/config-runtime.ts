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

/** Re-exported API for src/plugin-sdk, starting with resolve Default Agent Id. */
export { resolveDefaultAgentId } from "../agents/agent-scope.js";
/** Re-exported API for src/plugin-sdk. */
export {
  requireRuntimeConfig,
  resolveLivePluginConfigObject,
  resolvePluginConfigObject,
} from "./plugin-config-runtime.js";
/** Re-exported API for src/plugin-sdk. */
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
/** Re-exported API for src/plugin-sdk, starting with mutate Config File. */
export { mutateConfigFile, replaceConfigFile } from "../config/mutate.js";
/** Re-exported API for src/plugin-sdk, starting with Config Write After Write. */
export type { ConfigWriteAfterWrite } from "../config/runtime-snapshot.js";
/** Re-exported API for src/plugin-sdk, starting with log Config Updated. */
export { logConfigUpdated } from "../config/logging.js";
/** Re-exported API for src/plugin-sdk, starting with update Config. */
export { updateConfig } from "../commands/models/shared.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Channel Model Override. */
export { resolveChannelModelOverride } from "../channels/model-overrides.js";
/** Re-exported API for src/plugin-sdk. */
export {
  evaluateSupplementalContextVisibility,
  filterSupplementalContextItems,
} from "../security/context-visibility.js";
/** Re-exported API for src/plugin-sdk. */
export {
  resolveChannelContextVisibilityMode,
  resolveDefaultContextVisibility,
} from "../config/context-visibility.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Markdown Table Mode. */
export { resolveMarkdownTableMode } from "../config/markdown-tables.js";
/** Re-exported API for src/plugin-sdk. */
export {
  resolveChannelGroupPolicy,
  resolveChannelGroupRequireMention,
  resolveToolsBySender,
  type ChannelGroupPolicy,
} from "../config/group-policy.js";
/** Re-exported API for src/plugin-sdk. */
export {
  GROUP_POLICY_BLOCKED_LABEL,
  resolveAllowlistProviderRuntimeGroupPolicy,
  resolveDefaultGroupPolicy,
  resolveOpenProviderRuntimeGroupPolicy,
  warnMissingProviderGroupPolicyFallbackOnce,
} from "../config/runtime-group-policy.js";
/** Re-exported API for src/plugin-sdk. */
export {
  isNativeCommandsExplicitlyDisabled,
  resolveNativeCommandsEnabled,
  resolveNativeSkillsEnabled,
} from "../config/commands.js";
/** Re-exported API for src/plugin-sdk. */
export {
  TELEGRAM_COMMAND_NAME_PATTERN,
  normalizeTelegramCommandName,
  resolveTelegramCustomCommands,
} from "./telegram-command-config.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Active Talk Provider Config. */
export { resolveActiveTalkProviderConfig } from "../config/talk.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Agent Max Concurrent. */
export { resolveAgentMaxConcurrent } from "../config/agent-limits.js";
/** Re-exported API for src/plugin-sdk, starting with load Cron Store. */
export { loadCronStore, resolveCronStorePath, saveCronStore } from "../cron/store.js";
/** Re-exported API for src/plugin-sdk, starting with apply Model Override To Session Entry. */
export { applyModelOverrideToSessionEntry } from "../sessions/model-overrides.js";
/** Re-exported API for src/plugin-sdk, starting with coerce Secret Ref. */
export { coerceSecretRef } from "../config/types.secrets.js";
/** Re-exported API for src/plugin-sdk. */
export {
  resolveConfiguredSecretInputString,
  resolveConfiguredSecretInputWithFallback,
  resolveRequiredConfiguredSecretRefInputString,
} from "../gateway/resolve-configured-secret-input-string.js";
/** Re-exported API for src/plugin-sdk. */
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
/** Re-exported API for src/plugin-sdk. */
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
/** Re-exported API for src/plugin-sdk, starting with resolve Session Key. */
export { resolveSessionKey } from "../config/sessions/session-key.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Store Path. */
export { resolveStorePath } from "../config/sessions/paths.js";
/** Re-exported API for src/plugin-sdk, starting with Session Reset Mode. */
export type { SessionResetMode } from "../config/sessions/reset.js";
/** Re-exported API for src/plugin-sdk, starting with Session Scope. */
export type { SessionScope } from "../config/sessions/types.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Group Session Key. */
export { resolveGroupSessionKey } from "../config/sessions/group.js";
/** Re-exported API for src/plugin-sdk, starting with canonicalize Main Session Alias. */
export { canonicalizeMainSessionAlias } from "../config/sessions/main-session.js";
/** Re-exported API for src/plugin-sdk. */
export {
  evaluateSessionFreshness,
  resolveChannelResetConfig,
  resolveSessionResetPolicy,
  resolveSessionResetType,
  resolveThreadFlag,
} from "../config/sessions/reset.js";
/** Re-exported API for src/plugin-sdk. */
export {
  isDangerousNameMatchingEnabled,
  resolveDangerousNameMatchingEnabled,
} from "../config/dangerous-name-matching.js";
