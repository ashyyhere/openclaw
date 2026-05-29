/** Formatting helpers for node and pairing list output. */
import { normalizeStringifiedOptionalString } from "../../shared/string-coerce.js";

/** Re-exported API for src/cli/nodes-cli, starting with parse Node List. */
export { parseNodeList, parsePairingList } from "../../shared/node-list-parse.js";

/** Reused helper for format Permissions behavior in src/cli/nodes-cli. */
export function formatPermissions(raw: unknown) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return null;
  }
  const entries = Object.entries(raw as Record<string, unknown>)
    .map(([key, value]) => [normalizeStringifiedOptionalString(key) ?? "", value === true] as const)
    .filter(([key]) => key.length > 0)
    .toSorted((a, b) => a[0].localeCompare(b[0]));
  if (entries.length === 0) {
    return null;
  }
  const parts = entries.map(([key, granted]) => `${key}=${granted ? "yes" : "no"}`);
  return `[${parts.join(", ")}]`;
}
