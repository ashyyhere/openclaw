/** Runtime SDK barrel for setup wizard contracts and config helpers. */
export type { OpenClawConfig } from "../config/config.js";
/** Prompting interface used by setup wizards. */
export type { WizardPrompter } from "../wizard/prompts.js";
/** Clack-backed prompt adapter for interactive setup flows. */
export { createClackPrompter } from "../wizard/clack-prompter.js";
/** Factory for localized setup wizard text. */
export { createSetupTranslator } from "../wizard/i18n/index.js";
/** Setup wizard translation contracts. */
export type { SetupTranslator, WizardI18nParams } from "../wizard/i18n/index.js";
/** Adapter contract for channel setup implementations. */
export type { ChannelSetupAdapter } from "../channels/plugins/types.adapters.js";
/** Declarative channel setup wizard field and policy types. */
export type {
  ChannelSetupDmPolicy,
  ChannelSetupWizard,
  ChannelSetupWizardAllowFromEntry,
  ChannelSetupWizardTextInput,
} from "../channels/plugins/setup-wizard-types.js";

/** Default account id used by account-scoped setup helpers. */
export { DEFAULT_ACCOUNT_ID } from "../routing/session-key.js";

/** Account setup adapter wrappers and input presence validation helpers. */
export {
  createEnvPatchedAccountSetupAdapter,
  createPatchedAccountSetupAdapter,
  createSetupInputPresenceValidator,
} from "../channels/plugins/setup-helpers.js";

/** Shared channel setup sections, parsers, prompts, and config patch helpers. */
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

/** Proxy for allowlist-oriented channel setup wizards. */
export { createAllowlistSetupWizardProxy } from "../channels/plugins/setup-wizard-proxy.js";
/** Binary path text input helpers for delegated setup wizards. */
export {
  createCliPathTextInput,
  createDelegatedTextInputShouldPrompt,
} from "../channels/plugins/setup-wizard-binary.js";
/** Proxy for setup wizards delegated to external binaries or runtimes. */
export { createDelegatedSetupWizardProxy } from "../channels/plugins/setup-wizard-proxy.js";
