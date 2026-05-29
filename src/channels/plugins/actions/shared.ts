/** Shared helpers for channel action defaults and token-source checks. */
type OptionalDefaultGate<TKey extends string> = (key: TKey, defaultValue?: boolean) => boolean;

type TokenSourcedAccount = {
  tokenSource?: string | null;
};

/** Reused helper for list Token Sourced Accounts behavior in src/channels/plugins. */
export function listTokenSourcedAccounts<TAccount extends TokenSourcedAccount>(
  accounts: readonly TAccount[],
): TAccount[] {
  return accounts.filter((account) => account.tokenSource !== "none");
}

/** Reused helper for create Union Action Gate behavior in src/channels/plugins. */
export function createUnionActionGate<TAccount, TKey extends string>(
  accounts: readonly TAccount[],
  createGate: (account: TAccount) => OptionalDefaultGate<TKey>,
): OptionalDefaultGate<TKey> {
  const gates = accounts.map((account) => createGate(account));
  return (key, defaultValue = true) => gates.some((gate) => gate(key, defaultValue));
}
