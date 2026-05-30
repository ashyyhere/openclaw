// Allowlist matching helpers for elevated command access.
import { CHAT_CHANNEL_ORDER } from "../../channels/registry.js";
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalString,
} from "../../shared/string-coerce.js";
import { normalizeAtHashSlug } from "../../shared/string-normalization.js";

/** Explicit field prefixes accepted by elevated-command allowlist entries. */
export type ExplicitElevatedAllowField = "id" | "from" | "e164" | "name" | "username" | "tag";
const INTERNAL_ALLOWLIST_CHANNEL = "webchat";

const EXPLICIT_ELEVATED_ALLOW_FIELDS = new Set<ExplicitElevatedAllowField>([
  "id",
  "from",
  "e164",
  "name",
  "username",
  "tag",
]);

const SENDER_PREFIXES = [
  ...CHAT_CHANNEL_ORDER,
  INTERNAL_ALLOWLIST_CHANNEL,
  "user",
  "group",
  "channel",
];
const SENDER_PREFIX_RE = new RegExp(`^(${SENDER_PREFIXES.join("|")}):`, "i");

/** Channel-specific formatter used to derive comparable allowlist tokens. */
export type AllowFromFormatter = (values: string[]) => string[];

/** Remove channel/sender prefixes from allowlist probes before matching. */
export function stripSenderPrefix(value?: string): string {
  if (!value) {
    return "";
  }
  const trimmed = value.trim();
  return trimmed.replace(SENDER_PREFIX_RE, "");
}

/** Parse `field:value` elevated allowlist entries into typed parts. */
export function parseExplicitElevatedAllowEntry(
  entry: string,
): { field: ExplicitElevatedAllowField; value: string } | null {
  const separatorIndex = entry.indexOf(":");
  if (separatorIndex <= 0) {
    return null;
  }
  const fieldRaw = normalizeLowercaseStringOrEmpty(entry.slice(0, separatorIndex));
  if (!EXPLICIT_ELEVATED_ALLOW_FIELDS.has(fieldRaw as ExplicitElevatedAllowField)) {
    return null;
  }
  const value = entry.slice(separatorIndex + 1).trim();
  if (!value) {
    return null;
  }
  return {
    field: fieldRaw as ExplicitElevatedAllowField,
    value,
  };
}

function slugAllowToken(value?: string): string {
  return normalizeAtHashSlug(value);
}

function addTokenVariants(tokens: Set<string>, value: string): void {
  if (!value) {
    return;
  }
  tokens.add(value);
  const normalized = normalizeLowercaseStringOrEmpty(value);
  if (normalized) {
    tokens.add(normalized);
  }
}

/** Add channel-formatted allowlist token variants to a token set. */
export function addFormattedTokens(params: {
  formatAllowFrom: AllowFromFormatter;
  values: string[];
  tokens: Set<string>;
}): void {
  const formatted = params.formatAllowFrom(params.values);
  for (const entry of formatted) {
    addTokenVariants(params.tokens, entry);
  }
}

/** Test a value against precomputed channel-formatted allowlist tokens. */
export function matchesFormattedTokens(params: {
  formatAllowFrom: AllowFromFormatter;
  value: string;
  includeStripped?: boolean;
  tokens: Set<string>;
}): boolean {
  const probeTokens = new Set<string>();
  const values = params.includeStripped
    ? [params.value, stripSenderPrefix(params.value)].filter(Boolean)
    : [params.value];
  addFormattedTokens({
    formatAllowFrom: params.formatAllowFrom,
    values,
    tokens: probeTokens,
  });
  for (const token of probeTokens) {
    if (params.tokens.has(token)) {
      return true;
    }
  }
  return false;
}

/** Build mutable normalized token variants for an allowlist identity value. */
export function buildMutableTokens(value?: string): Set<string> {
  const tokens = new Set<string>();
  const trimmed = normalizeOptionalString(value);
  if (!trimmed) {
    return tokens;
  }
  addTokenVariants(tokens, trimmed);
  const slugged = slugAllowToken(trimmed);
  if (slugged) {
    addTokenVariants(tokens, slugged);
  }
  return tokens;
}

/** Test a value against mutable normalized token variants. */
export function matchesMutableTokens(value: string, tokens: Set<string>): boolean {
  if (!value || tokens.size === 0) {
    return false;
  }
  const probes = new Set<string>();
  addTokenVariants(probes, value);
  const slugged = slugAllowToken(value);
  if (slugged) {
    addTokenVariants(probes, slugged);
  }
  for (const probe of probes) {
    if (tokens.has(probe)) {
      return true;
    }
  }
  return false;
}
