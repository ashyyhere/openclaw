/** Normalizes subagent session keys used across registry and session-store lookups. */
import { normalizeOptionalString } from "../shared/string-coerce.js";

/** Reused constant for normalize Subagent Session Key behavior in src/agents. */
export const normalizeSubagentSessionKey = normalizeOptionalString;
