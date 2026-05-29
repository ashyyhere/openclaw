/** Shared status issue normalization helpers for channel account snapshots. */
import { normalizeOptionalString } from "../../../shared/string-coerce.js";
import { isRecord } from "../../../utils.js";
import type { ChannelAccountSnapshot, ChannelStatusIssue } from "../types.public.js";
/** Re-exported API for src/channels/plugins, starting with is Record. */
export { isRecord };

/** Reused helper for as String behavior in src/channels/plugins. */
export function asString(value: unknown): string | undefined {
  return typeof value === "string" ? normalizeOptionalString(value) : undefined;
}

/** Reused helper for format Match Metadata behavior in src/channels/plugins. */
export function formatMatchMetadata(params: {
  matchKey?: unknown;
  matchSource?: unknown;
}): string | undefined {
  const matchKey =
    typeof params.matchKey === "string"
      ? params.matchKey
      : typeof params.matchKey === "number"
        ? String(params.matchKey)
        : undefined;
  const matchSource = asString(params.matchSource);
  const parts = [
    matchKey ? `matchKey=${matchKey}` : null,
    matchSource ? `matchSource=${matchSource}` : null,
  ].filter((entry): entry is string => Boolean(entry));
  return parts.length > 0 ? parts.join(" ") : undefined;
}

/** Reused helper for append Match Metadata behavior in src/channels/plugins. */
export function appendMatchMetadata(
  message: string,
  params: { matchKey?: unknown; matchSource?: unknown },
): string {
  const meta = formatMatchMetadata(params);
  return meta ? `${message} (${meta})` : message;
}

/** Reused helper for resolve Enabled Configured Account Id behavior in src/channels/plugins. */
export function resolveEnabledConfiguredAccountId(account: {
  accountId?: unknown;
  enabled?: unknown;
  configured?: unknown;
}): string | null {
  const accountId = asString(account.accountId) ?? "default";
  const enabled = account.enabled !== false;
  const configured = account.configured === true;
  return enabled && configured ? accountId : null;
}

/** Reused helper for collect Issues For Enabled Accounts behavior in src/channels/plugins. */
export function collectIssuesForEnabledAccounts<
  T extends { accountId?: unknown; enabled?: unknown },
>(params: {
  accounts: ChannelAccountSnapshot[];
  readAccount: (value: ChannelAccountSnapshot) => T | null;
  collectIssues: (params: { account: T; accountId: string; issues: ChannelStatusIssue[] }) => void;
}): ChannelStatusIssue[] {
  const issues: ChannelStatusIssue[] = [];
  for (const entry of params.accounts) {
    const account = params.readAccount(entry);
    if (!account || account.enabled === false) {
      continue;
    }
    const accountId = asString(account.accountId) ?? "default";
    params.collectIssues({ account, accountId, issues });
  }
  return issues;
}
