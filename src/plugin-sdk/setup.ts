// Shared setup wizard/types/helpers for plugin and channel setup surfaces.

/** Re-exported API for src/plugin-sdk, starting with Open Claw Config. */
export type { OpenClawConfig } from "../config/config.js";
/** Re-exported API for src/plugin-sdk, starting with Dm Policy. */
export type { DmPolicy, GroupPolicy } from "../config/types.js";
/** Re-exported API for src/plugin-sdk, starting with Secret Input. */
export type { SecretInput } from "../config/types.secrets.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  WizardMultiSelectParams,
  WizardProgress,
  WizardPrompter,
  WizardSelectParams,
} from "../wizard/prompts.js";
/** Re-exported API for src/plugin-sdk, starting with Wizard Cancelled Error. */
export { WizardCancelledError } from "../wizard/prompts.js";
/** Re-exported API for src/plugin-sdk, starting with create Setup Translator. */
export { createSetupTranslator } from "../wizard/i18n/index.js";
/** Re-exported API for src/plugin-sdk, starting with Setup Translator. */
export type { SetupTranslator, WizardI18nParams } from "../wizard/i18n/index.js";
/** Re-exported API for src/plugin-sdk, starting with Channel Setup Adapter. */
export type { ChannelSetupAdapter } from "../channels/plugins/types.adapters.js";
/** Re-exported API for src/plugin-sdk, starting with Channel Setup Input. */
export type { ChannelSetupInput } from "../channels/plugins/types.core.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  ChannelSetupDmPolicy,
  ChannelSetupWizardAdapter,
  ChannelSetupWizard,
  ChannelSetupWizardAllowFromEntry,
  ChannelSetupWizardTextInput,
} from "../channels/plugins/setup-wizard-types.js";

/** Re-exported API for src/plugin-sdk, starting with DEFAULT ACCOUNT ID. */
export { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "../routing/session-key.js";
/** Re-exported API for src/plugin-sdk, starting with format Cli Command. */
export { formatCliCommand } from "../cli/command-format.js";
/** Re-exported API for src/plugin-sdk, starting with detect Binary. */
export { detectBinary } from "../plugins/setup-binary.js";
export { formatDocsLink } from "../../packages/terminal-core/src/links.js";
export { hasConfiguredSecretInput, normalizeSecretInputString } from "../config/types.secrets.js";
/** Re-exported API for src/plugin-sdk, starting with normalize E164. */
export { normalizeE164, pathExists } from "../utils.js";

/** Re-exported API for src/plugin-sdk. */
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
/** Re-exported API for src/plugin-sdk. */
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
/** Re-exported API for src/plugin-sdk, starting with prompt Channel Access Config. */
export { promptChannelAccessConfig } from "../channels/plugins/setup-group-access.js";
/** Re-exported API for src/plugin-sdk, starting with create Allowlist Setup Wizard Proxy. */
export { createAllowlistSetupWizardProxy } from "../channels/plugins/setup-wizard-proxy.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createDelegatedFinalize,
  createDelegatedPrepare,
  createDelegatedResolveConfigured,
  createDelegatedSetupWizardProxy,
} from "../channels/plugins/setup-wizard-proxy.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createCliPathTextInput,
  createDelegatedSetupWizardStatusResolvers,
  createDelegatedTextInputShouldPrompt,
  createDetectedBinaryStatus,
} from "../channels/plugins/setup-wizard-binary.js";

/** Re-exported API for src/plugin-sdk, starting with format Resolved Unresolved Note. */
export { formatResolvedUnresolvedNote } from "./resolution-notes.js";
