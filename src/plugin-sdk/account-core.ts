/** Public SDK barrel for account lookup, normalization, and default-account fallback helpers. */
export type { OpenClawConfig } from "../config/config.js";

/** Account action gate used by channel plugins to serialize account-scoped operations. */
export { createAccountActionGate } from "../channels/plugins/account-action-gate.js";
/** Account config merge/list/describe helpers for channel plugin setup code. */
export {
  createAccountListHelpers,
  describeAccountSnapshot,
  hasConfiguredAccountValue,
  listCombinedAccountIds,
  mergeAccountConfig,
  resolveListedDefaultAccountId,
  resolveMergedAccountConfig,
} from "../channels/plugins/account-helpers.js";
/** Normalize channel chat-type labels. */
export { normalizeChatType } from "../channels/chat-type.js";
/** Resolve account config entries by normalized account id. */
export { resolveAccountEntry, resolveNormalizedAccountEntry } from "../routing/account-lookup.js";
/** Account-id constants and normalizers shared with routing/session helpers. */
export {
  DEFAULT_ACCOUNT_ID,
  normalizeAccountId,
  normalizeOptionalAccountId,
} from "../routing/session-key.js";
/** Phone/path normalization helpers used by account-backed channel plugins. */
export { normalizeE164, pathExists, resolveUserPath } from "../utils.js";
/** List configured account ids from root config. */
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
