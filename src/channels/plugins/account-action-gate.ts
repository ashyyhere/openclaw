// Account action gating helpers for channel plugin status/actions.
/** Shared type for Action Gate in src/channels/plugins. */
export type ActionGate<T extends Record<string, boolean | undefined>> = (
  key: keyof T,
  defaultValue?: boolean,
) => boolean;

/** Reused helper for create Account Action Gate behavior in src/channels/plugins. */
export function createAccountActionGate<T extends Record<string, boolean | undefined>>(params: {
  baseActions?: T;
  accountActions?: T;
}): ActionGate<T> {
  return (key, defaultValue = true) => {
    const accountValue = params.accountActions?.[key];
    if (accountValue !== undefined) {
      return accountValue;
    }
    const baseValue = params.baseActions?.[key];
    if (baseValue !== undefined) {
      return baseValue;
    }
    return defaultValue;
  };
}
