/** Normalizes subagent session keys used across registry and session-store lookups. */
import { normalizeOptionalString } from "../shared/string-coerce.js";

/** Normalizes optional subagent session keys before registry and store lookups. */
export const normalizeSubagentSessionKey = normalizeOptionalString;
