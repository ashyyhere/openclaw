// gateway session child sessions helpers and runtime behavior.
import { loadCombinedSessionStoreForGateway } from "../config/sessions/combined-store-gateway.js";
import type { SessionEntry } from "../config/sessions/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { normalizeOptionalString } from "../shared/string-coerce.js";

/** Shared type for Direct Child Session Entry in src/gateway. */
export type DirectChildSessionEntry = {
  sessionKey: string;
  entry: SessionEntry;
};

/** Reused helper for is Direct Child Session Entry behavior in src/gateway. */
export function isDirectChildSessionEntry(params: {
  sessionKey: string;
  entry: SessionEntry | undefined;
  parentKey: string;
}): boolean {
  const parentKey = normalizeOptionalString(params.parentKey);
  if (!parentKey || params.sessionKey === parentKey || !params.entry) {
    return false;
  }
  return (
    normalizeOptionalString(params.entry.spawnedBy) === parentKey ||
    normalizeOptionalString(params.entry.parentSessionKey) === parentKey
  );
}

/** Reused helper for find Direct Child Sessions For Parent behavior in src/gateway. */
export function findDirectChildSessionsForParent(params: {
  cfg: OpenClawConfig;
  parentKey: string;
}): DirectChildSessionEntry[] {
  const { store } = loadCombinedSessionStoreForGateway(params.cfg);
  return Object.entries(store)
    .filter(([sessionKey, entry]) =>
      isDirectChildSessionEntry({
        sessionKey,
        entry,
        parentKey: params.parentKey,
      }),
    )
    .map(([sessionKey, entry]) => ({ sessionKey, entry }));
}
