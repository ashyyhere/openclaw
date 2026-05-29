// routing account lookup helpers and runtime behavior.
import { normalizeLowercaseStringOrEmpty } from "../shared/string-coerce.js";

/** Reused helper for resolve Account Entry behavior in src/routing. */
export function resolveAccountEntry<T>(
  accounts: Record<string, T> | undefined,
  accountId: string,
): T | undefined {
  if (!accounts || typeof accounts !== "object") {
    return undefined;
  }
  if (Object.hasOwn(accounts, accountId)) {
    return accounts[accountId];
  }
  const normalized = normalizeLowercaseStringOrEmpty(accountId);
  const matchKey = Object.keys(accounts).find(
    (key) => normalizeLowercaseStringOrEmpty(key) === normalized,
  );
  return matchKey ? accounts[matchKey] : undefined;
}

/** Reused helper for resolve Normalized Account Entry behavior in src/routing. */
export function resolveNormalizedAccountEntry<T>(
  accounts: Record<string, T> | undefined,
  accountId: string,
  normalizeAccountId: (accountId: string) => string,
): T | undefined {
  if (!accounts || typeof accounts !== "object") {
    return undefined;
  }
  if (Object.hasOwn(accounts, accountId)) {
    return accounts[accountId];
  }
  const normalized = normalizeAccountId(accountId);
  const matchKey = Object.keys(accounts).find((key) => normalizeAccountId(key) === normalized);
  return matchKey ? accounts[matchKey] : undefined;
}
