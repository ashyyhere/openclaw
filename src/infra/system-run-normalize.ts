// Normalizes loose system-run config values into strict strings and arrays.
import { mapAllowFromEntries } from "openclaw/plugin-sdk/channel-config-helpers";
import { normalizeOptionalString } from "../shared/string-coerce.js";

/** Returns a trimmed non-empty string from unknown input. */
export function normalizeNonEmptyString(value: unknown): string | null {
  return typeof value === "string" ? (normalizeOptionalString(value) ?? null) : null;
}

/** Normalizes allowFrom-style unknown input into a string array. */
export function normalizeStringArray(value: unknown): string[] {
  return Array.isArray(value) ? mapAllowFromEntries(value) : [];
}
