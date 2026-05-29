// Formats operator guidance for missing or ambiguous default channel accounts.
function formatChannelDefaultAccountPath(channelKey: string): string {
  return `channels.${channelKey}.defaultAccount`;
}

/** Formats the config path for an account-map default entry. */
export function formatChannelAccountsDefaultPath(channelKey: string): string {
  return `channels.${channelKey}.accounts.default`;
}

/** Formats a short instruction for adding any explicit default account. */
export function formatSetExplicitDefaultInstruction(channelKey: string): string {
  return `Set ${formatChannelDefaultAccountPath(channelKey)} or add ${formatChannelAccountsDefaultPath(channelKey)}`;
}

/** Formats a short instruction for selecting from already configured accounts. */
export function formatSetExplicitDefaultToConfiguredInstruction(params: {
  channelKey: string;
}): string {
  return `Set ${formatChannelDefaultAccountPath(params.channelKey)} to one of these accounts, or add ${formatChannelAccountsDefaultPath(params.channelKey)}`;
}
