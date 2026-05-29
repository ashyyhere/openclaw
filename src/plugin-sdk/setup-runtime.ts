/** Runtime SDK barrel for setup wizard contracts and config helpers. */
export type { OpenClawConfig } from "../config/config.js";
/** Re-exported API for src/plugin-sdk, starting with Wizard Prompter. */
export type { WizardPrompter } from "../wizard/prompts.js";
/** Re-exported API for src/plugin-sdk, starting with create Clack Prompter. */
export { createClackPrompter } from "../wizard/clack-prompter.js";
/** Re-exported API for src/plugin-sdk, starting with create Setup Translator. */
export { createSetupTranslator } from "../wizard/i18n/index.js";
/** Re-exported API for src/plugin-sdk, starting with Setup Translator. */
export type { SetupTranslator, WizardI18nParams } from "../wizard/i18n/index.js";
/** Re-exported API for src/plugin-sdk, starting with Channel Setup Adapter. */
export type { ChannelSetupAdapter } from "../channels/plugins/types.adapters.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  ChannelSetupDmPolicy,
  ChannelSetupWizard,
  ChannelSetupWizardAllowFromEntry,
  ChannelSetupWizardTextInput,
} from "../channels/plugins/setup-wizard-types.js";

/** Re-exported API for src/plugin-sdk, starting with DEFAULT ACCOUNT ID. */
export { DEFAULT_ACCOUNT_ID } from "../routing/session-key.js";

/** Re-exported API for src/plugin-sdk. */
export {
  createEnvPatchedAccountSetupAdapter,
  createPatchedAccountSetupAdapter,
  createSetupInputPresenceValidator,
} from "../channels/plugins/setup-helpers.js";

/** Re-exported API for src/plugin-sdk. */
export {
  createAccountScopedAllowFromSection,
  createAccountScopedGroupAccessSection,
  createTopLevelChannelDmPolicy,
  createLegacyCompatChannelDmPolicy,
  createStandardChannelSetupStatus,
  mergeAllowFromEntries,
  noteChannelLookupFailure,
  noteChannelLookupSummary,
  parseSetupEntriesAllowingWildcard,
  parseMentionOrPrefixedId,
  patchChannelConfigForAccount,
  promptResolvedAllowFrom,
  promptLegacyChannelAllowFromForAccount,
  promptParsedAllowFromForAccount,
  resolveEntriesWithOptionalToken,
  resolveSetupAccountId,
  setAccountAllowFromForChannel,
  setSetupChannelEnabled,
  splitSetupEntries,
} from "../channels/plugins/setup-wizard-helpers.js";

/** Re-exported API for src/plugin-sdk, starting with create Allowlist Setup Wizard Proxy. */
export { createAllowlistSetupWizardProxy } from "../channels/plugins/setup-wizard-proxy.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createCliPathTextInput,
  createDelegatedTextInputShouldPrompt,
} from "../channels/plugins/setup-wizard-binary.js";
/** Re-exported API for src/plugin-sdk, starting with create Delegated Setup Wizard Proxy. */
export { createDelegatedSetupWizardProxy } from "../channels/plugins/setup-wizard-proxy.js";
