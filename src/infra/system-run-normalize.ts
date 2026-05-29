// infra system run normalize helpers and runtime behavior.
import { mapAllowFromEntries } from "openclaw/plugin-sdk/channel-config-helpers";
import { normalizeOptionalString } from "../shared/string-coerce.js";

/** Reused helper for normalize Non Empty String behavior in src/infra. */
export function normalizeNonEmptyString(value: unknown): string | null {
  return typeof value === "string" ? (normalizeOptionalString(value) ?? null) : null;
}

/** Reused helper for normalize String Array behavior in src/infra. */
export function normalizeStringArray(value: unknown): string[] {
  return Array.isArray(value) ? mapAllowFromEntries(value) : [];
}
