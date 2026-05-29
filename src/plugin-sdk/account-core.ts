/** Public SDK barrel for account lookup, normalization, and default-account fallback helpers. */
export type { OpenClawConfig } from "../config/config.js";

/** Re-exported API for src/plugin-sdk, starting with create Account Action Gate. */
export { createAccountActionGate } from "../channels/plugins/account-action-gate.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createAccountListHelpers,
  describeAccountSnapshot,
  hasConfiguredAccountValue,
  listCombinedAccountIds,
  mergeAccountConfig,
  resolveListedDefaultAccountId,
  resolveMergedAccountConfig,
} from "../channels/plugins/account-helpers.js";
/** Re-exported API for src/plugin-sdk, starting with normalize Chat Type. */
export { normalizeChatType } from "../channels/chat-type.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Account Entry. */
export { resolveAccountEntry, resolveNormalizedAccountEntry } from "../routing/account-lookup.js";
/** Re-exported API for src/plugin-sdk. */
export {
  DEFAULT_ACCOUNT_ID,
  normalizeAccountId,
  normalizeOptionalAccountId,
} from "../routing/session-key.js";
/** Re-exported API for src/plugin-sdk, starting with normalize E164. */
export { normalizeE164, pathExists, resolveUserPath } from "../utils.js";
/** Re-exported API for src/plugin-sdk, starting with list Configured Account Ids. */
export { listConfiguredAccountIds } from "./account-configured-ids.js";

/** Resolve an account by id, then fall back to the default account when the primary lacks credentials. */
export function resolveAccountWithDefaultFallback<TAccount>(params: {
  accountId?: string | null;
  normalizeAccountId: (accountId?: string | null) => string;
  resolvePrimary: (accountId: string) => TAccount;
  hasCredential: (account: TAccount) => boolean;
  resolveDefaultAccountId: () => string;
}): TAccount {
  const hasExplicitAccountId = Boolean(params.accountId?.trim());
  const normalizedAccountId = params.normalizeAccountId(params.accountId);
  const primary = params.resolvePrimary(normalizedAccountId);
  if (hasExplicitAccountId || params.hasCredential(primary)) {
    return primary;
  }

  // Implicit/default lookups may land on an empty account shell; retry the configured
  // default only when it is distinct and actually credentialed.
  const fallbackId = params.resolveDefaultAccountId();
  if (fallbackId === normalizedAccountId) {
    return primary;
  }
  const fallback = params.resolvePrimary(fallbackId);
  if (!params.hasCredential(fallback)) {
    return primary;
  }
  return fallback;
}
