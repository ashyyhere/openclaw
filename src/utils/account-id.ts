// utils account id helpers and runtime behavior.
import { normalizeOptionalAccountId } from "../routing/account-id.js";

/** Reused helper for normalize Account Id behavior in src/utils. */
export function normalizeAccountId(value?: string): string | undefined {
  return normalizeOptionalAccountId(value);
}
