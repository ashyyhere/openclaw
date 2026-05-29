// Finds channel account config entries with exact or normalized id matching.
import { normalizeLowercaseStringOrEmpty } from "../shared/string-coerce.js";

/** Resolves an account entry by exact key, then case-insensitive key match. */
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

/** Resolves an account entry using a caller-provided account-id normalizer. */
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
