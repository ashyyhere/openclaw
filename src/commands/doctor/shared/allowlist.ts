/** Shared allowlist helpers for doctor channel checks. */
import { normalizeStringEntries } from "../../../shared/string-normalization.js";
import type { DoctorAllowFromList } from "../types.js";

/** Reused helper for has Allow From Entries behavior in src/commands/doctor. */
export function hasAllowFromEntries(list?: DoctorAllowFromList) {
  return Array.isArray(list) && normalizeStringEntries(list).length > 0;
}
