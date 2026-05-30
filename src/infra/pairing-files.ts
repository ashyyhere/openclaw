// Shared JSON-file and pending-request helpers for device/node pairing stores.
import path from "node:path";
import { resolveStateDir } from "../config/paths.js";

/** JSON persistence primitives reused by pairing state stores. */
export { createAsyncLock, readJsonIfExists, tryReadJson, writeJson } from "./json-files.js";

/** Resolves pending/paired JSON file paths for a pairing state subdirectory. */
export function resolvePairingPaths(baseDir: string | undefined, subdir: string) {
  const root = baseDir ?? resolveStateDir();
  const dir = path.join(root, subdir);
  return {
    dir,
    pendingPath: path.join(dir, "pending.json"),
    pairedPath: path.join(dir, "paired.json"),
  };
}

/** Coerces unknown JSON state into a pairing record map. */
export function coercePairingStateRecord<T>(value: unknown): Record<string, T> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return value as Record<string, T>;
}

/** Removes pending pairing entries older than the TTL from a mutable map. */
export function pruneExpiredPending<T extends { ts: number }>(
  pendingById: Record<string, T>,
  nowMs: number,
  ttlMs: number,
) {
  for (const [id, req] of Object.entries(pendingById)) {
    if (nowMs - req.ts > ttlMs) {
      delete pendingById[id];
    }
  }
}

/** Result returned after refreshing or creating a pending pairing request. */
export type PendingPairingRequestResult<TPending> = {
  status: "pending";
  request: TPending;
  created: boolean;
};

/** Refreshes a single compatible pending pairing or replaces stale/conflicting entries. */
export async function reconcilePendingPairingRequests<
  TPending extends { requestId: string },
  TIncoming,
>(params: {
  pendingById: Record<string, TPending>;
  existing: readonly TPending[];
  incoming: TIncoming;
  canRefreshSingle: (existing: TPending, incoming: TIncoming) => boolean;
  refreshSingle: (existing: TPending, incoming: TIncoming) => TPending;
  buildReplacement: (params: { existing: readonly TPending[]; incoming: TIncoming }) => TPending;
  persist: () => Promise<void>;
}): Promise<PendingPairingRequestResult<TPending>> {
  if (
    params.existing.length === 1 &&
    params.canRefreshSingle(params.existing[0], params.incoming)
  ) {
    const refreshed = params.refreshSingle(params.existing[0], params.incoming);
    params.pendingById[refreshed.requestId] = refreshed;
    await params.persist();
    return { status: "pending", request: refreshed, created: false };
  }

  for (const existing of params.existing) {
    delete params.pendingById[existing.requestId];
  }

  const request = params.buildReplacement({
    existing: params.existing,
    incoming: params.incoming,
  });
  params.pendingById[request.requestId] = request;
  await params.persist();
  return { status: "pending", request, created: true };
}
