// routing default account warnings helpers and runtime behavior.
function formatChannelDefaultAccountPath(channelKey: string): string {
  return `channels.${channelKey}.defaultAccount`;
}

/** Reused helper for format Channel Accounts Default Path behavior in src/routing. */
export function formatChannelAccountsDefaultPath(channelKey: string): string {
  return `channels.${channelKey}.accounts.default`;
}

/** Reused helper for format Set Explicit Default Instruction behavior in src/routing. */
export function formatSetExplicitDefaultInstruction(channelKey: string): string {
  return `Set ${formatChannelDefaultAccountPath(channelKey)} or add ${formatChannelAccountsDefaultPath(channelKey)}`;
}

/** Reused helper for format Set Explicit Default To Configured Instruction behavior in src/routing. */
export function formatSetExplicitDefaultToConfiguredInstruction(params: {
  channelKey: string;
}): string {
  return `Set ${formatChannelDefaultAccountPath(params.channelKey)} to one of these accounts, or add ${formatChannelAccountsDefaultPath(params.channelKey)}`;
}
