// Shared setup wizard/types/helpers for plugin and channel setup surfaces.

/** OpenClaw config shape accepted by setup adapters. */
export type { OpenClawConfig } from "../config/config.js";
/** Channel DM and group policy config contracts. */
export type { DmPolicy, GroupPolicy } from "../config/types.js";
/** Secret input shape used by setup prompts and config patches. */
export type { SecretInput } from "../config/types.secrets.js";
/** Wizard prompt contracts available to plugin setup flows. */
export type {
  WizardMultiSelectParams,
  WizardProgress,
  WizardPrompter,
  WizardSelectParams,
} from "../wizard/prompts.js";
/** Error thrown when an interactive setup wizard is cancelled. */
export { WizardCancelledError } from "../wizard/prompts.js";
/** Factory for localized setup wizard strings. */
export { createSetupTranslator } from "../wizard/i18n/index.js";
/** Setup wizard translation contracts. */
export type { SetupTranslator, WizardI18nParams } from "../wizard/i18n/index.js";
/** Channel setup adapter contract implemented by plugins. */
export type { ChannelSetupAdapter } from "../channels/plugins/types.adapters.js";
/** Runtime input passed into channel setup adapters. */
export type { ChannelSetupInput } from "../channels/plugins/types.core.js";
/** Channel setup wizard contracts and parsed input shapes. */
export type {
  ChannelSetupDmPolicy,
  ChannelSetupWizardAdapter,
  ChannelSetupWizard,
  ChannelSetupWizardAllowFromEntry,
  ChannelSetupWizardTextInput,
} from "../channels/plugins/setup-wizard-types.js";

/** Account id helpers used by multi-account channel setup. */
export { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "../routing/session-key.js";
/** CLI command formatter for setup instructions. */
export { formatCliCommand } from "../cli/command-format.js";
/** Binary detector used by setup prerequisites. */
export { detectBinary } from "../plugins/setup-binary.js";
export { formatDocsLink } from "../../packages/terminal-core/src/links.js";
export { hasConfiguredSecretInput, normalizeSecretInputString } from "../config/types.secrets.js";
/** Common setup utilities for phone numbers and filesystem checks. */
export { normalizeE164, pathExists } from "../utils.js";

/** Account-scoped setup config patch and validation helpers. */
export {
  moveSingleAccountChannelSectionToDefaultAccount,
  applyAccountNameToChannelSection,
  applySetupAccountConfigPatch,
  createEnvPatchedAccountSetupAdapter,
  createSetupInputPresenceValidator,
  createPatchedAccountSetupAdapter,
  createZodSetupInputValidator,
  migrateBaseNameToDefaultAccount,
  patchScopedAccountConfig,
  prepareScopedSetupConfig,
} from "../channels/plugins/setup-helpers.js";
/** Channel setup allowlist, DM policy, group policy, and prompt helpers. */
export {
  addWildcardAllowFrom,
  buildSingleChannelSecretPromptState,
  createAccountScopedAllowFromSection,
  createAccountScopedGroupAccessSection,
  createAllowFromSection,
  createLegacyCompatChannelDmPolicy,
  createNestedChannelParsedAllowFromPrompt,
  createPromptParsedAllowFromForAccount,
  createStandardChannelSetupStatus,
  createNestedChannelAllowFromSetter,
  createNestedChannelDmPolicy,
  createNestedChannelDmPolicySetter,
  createTopLevelChannelAllowFromSetter,
  createTopLevelChannelDmPolicy,
  createTopLevelChannelDmPolicySetter,
  createTopLevelChannelGroupPolicySetter,
  createTopLevelChannelParsedAllowFromPrompt,
  mergeAllowFromEntries,
  normalizeAllowFromEntries,
  noteChannelLookupFailure,
  noteChannelLookupSummary,
  parseMentionOrPrefixedId,
  parseSetupEntriesAllowingWildcard,
  parseSetupEntriesWithParser,
  patchNestedChannelConfigSection,
  patchTopLevelChannelConfigSection,
  patchChannelConfigForAccount,
  promptAccountId,
  promptLegacyChannelAllowFrom,
  promptLegacyChannelAllowFromForAccount,
  promptParsedAllowFromForAccount,
  promptParsedAllowFromForScopedChannel,
  promptSingleChannelSecretInput,
  promptResolvedAllowFrom,
  resolveParsedAllowFromEntries,
  resolveEntriesWithOptionalToken,
  resolveSetupAccountId,
  resolveGroupAllowlistWithLookupNotes,
  runSingleChannelSecretStep,
  setAccountAllowFromForChannel,
  setAccountDmAllowFromForChannel,
  setAccountGroupPolicyForChannel,
  setChannelDmPolicyWithAllowFrom,
  setLegacyChannelDmPolicyWithAllowFrom,
  setNestedChannelAllowFrom,
  setNestedChannelDmPolicyWithAllowFrom,
  setSetupChannelEnabled,
  setTopLevelChannelAllowFrom,
  setTopLevelChannelDmPolicyWithAllowFrom,
  setTopLevelChannelGroupPolicy,
  splitSetupEntries,
} from "../channels/plugins/setup-wizard-helpers.js";
/** Prompt flow for channel access and group allowlist config. */
export { promptChannelAccessConfig } from "../channels/plugins/setup-group-access.js";
/** Proxy helper for setup wizards that only need allowlist prompts. */
export { createAllowlistSetupWizardProxy } from "../channels/plugins/setup-wizard-proxy.js";
/** Delegation helpers for composing setup wizard prepare/finalize/status flows. */
export {
  createDelegatedFinalize,
  createDelegatedPrepare,
  createDelegatedResolveConfigured,
  createDelegatedSetupWizardProxy,
} from "../channels/plugins/setup-wizard-proxy.js";
/** Binary-driven setup wizard text inputs and status resolvers. */
export {
  createCliPathTextInput,
  createDelegatedSetupWizardStatusResolvers,
  createDelegatedTextInputShouldPrompt,
  createDetectedBinaryStatus,
} from "../channels/plugins/setup-wizard-binary.js";

/** Formats resolved/unresolved setup notes for status output. */
export { formatResolvedUnresolvedNote } from "./resolution-notes.js";
