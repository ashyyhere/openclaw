// extensions/discord/src setup runtime helpers helpers and runtime behavior.
export {
  createAccountScopedAllowFromSection,
  createAccountScopedGroupAccessSection,
  createLegacyCompatChannelDmPolicy,
  parseMentionOrPrefixedId,
  patchChannelConfigForAccount,
  promptLegacyChannelAllowFromForAccount,
  resolveEntriesWithOptionalToken,
  setSetupChannelEnabled,
} from "openclaw/plugin-sdk/setup-runtime";
