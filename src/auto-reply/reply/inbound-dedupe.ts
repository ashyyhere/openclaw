// Inbound message deduplication cache.
import { logVerbose, shouldLogVerbose } from "../../globals.js";
import { resolveGlobalDedupeCache, type DedupeCache } from "../../infra/dedupe.js";
import { channelRouteDedupeKey } from "../../plugin-sdk/channel-route.js";
import { parseAgentSessionKey } from "../../sessions/session-key-utils.js";
import { resolveGlobalSingleton } from "../../shared/global-singleton.js";
import {
  normalizeOptionalLowercaseString,
  normalizeOptionalString,
} from "../../shared/string-coerce.js";
import { resolveCommandTurnTargetSessionKey } from "../command-turn-context.js";
import type { MsgContext } from "../templating.js";

const DEFAULT_INBOUND_DEDUPE_TTL_MS = 20 * 60_000;
const DEFAULT_INBOUND_DEDUPE_MAX = 5000;

/**
 * Keep inbound dedupe shared across bundled chunks so the same provider
 * message cannot bypass dedupe by entering through a different chunk copy.
 */
const INBOUND_DEDUPE_CACHE_KEY = Symbol.for("openclaw.inboundDedupeCache");
const INBOUND_DEDUPE_INFLIGHT_KEY = Symbol.for("openclaw.inboundDedupeInflight");

const inboundDedupeCache: DedupeCache = resolveGlobalDedupeCache(INBOUND_DEDUPE_CACHE_KEY, {
  ttlMs: DEFAULT_INBOUND_DEDUPE_TTL_MS,
  maxSize: DEFAULT_INBOUND_DEDUPE_MAX,
});
const inboundDedupeInFlight = resolveGlobalSingleton(
  INBOUND_DEDUPE_INFLIGHT_KEY,
  () => new Set<string>(),
);

/** Result of attempting to claim one inbound message for processing. */
export type InboundDedupeClaimResult =
  | { status: "invalid" }
  | { status: "duplicate"; key: string }
  | { status: "inflight"; key: string }
  | { status: "claimed"; key: string };

const resolveInboundPeerId = (ctx: MsgContext) =>
  ctx.OriginatingTo ?? ctx.To ?? ctx.From ?? ctx.SessionKey;

function resolveInboundDedupeSessionScope(ctx: MsgContext): string {
  const sessionKey =
    resolveCommandTurnTargetSessionKey(ctx) || normalizeOptionalString(ctx.SessionKey) || "";
  if (!sessionKey) {
    return "";
  }
  const parsed = parseAgentSessionKey(sessionKey);
  if (!parsed) {
    return sessionKey;
  }
  // The same physical inbound message should never run twice for the same
  // agent, even if a routing bug presents it under both main and direct keys.
  return `agent:${parsed.agentId}`;
}

/** Build a stable dedupe key from inbound route, message id, and agent session scope. */
export function buildInboundDedupeKey(ctx: MsgContext): string | null {
  const provider =
    normalizeOptionalLowercaseString(ctx.OriginatingChannel ?? ctx.Provider ?? ctx.Surface) || "";
  const messageId = normalizeOptionalString(ctx.MessageSid);
  if (!provider || !messageId) {
    return null;
  }
  const peerId = resolveInboundPeerId(ctx);
  if (!peerId) {
    return null;
  }
  const sessionScope = resolveInboundDedupeSessionScope(ctx);
  const accountId = normalizeOptionalString(ctx.AccountId) ?? "";
  const routeKey = channelRouteDedupeKey({
    channel: provider,
    to: peerId,
    accountId,
    threadId: ctx.MessageThreadId,
  });
  return JSON.stringify([sessionScope, routeKey, messageId]);
}

/** Check and mark a duplicate inbound message using the shared dedupe cache. */
export function shouldSkipDuplicateInbound(
  ctx: MsgContext,
  opts?: { cache?: DedupeCache; now?: number },
): boolean {
  const key = buildInboundDedupeKey(ctx);
  if (!key) {
    return false;
  }
  const cache = opts?.cache ?? inboundDedupeCache;
  const skipped = cache.check(key, opts?.now);
  if (skipped && shouldLogVerbose()) {
    logVerbose(`inbound dedupe: skipped ${key}`);
  }
  return skipped;
}

/** Claim an inbound message while preventing concurrent processing of the same key. */
export function claimInboundDedupe(
  ctx: MsgContext,
  opts?: { cache?: DedupeCache; now?: number; inFlight?: Set<string> },
): InboundDedupeClaimResult {
  const key = buildInboundDedupeKey(ctx);
  if (!key) {
    return { status: "invalid" };
  }
  const cache = opts?.cache ?? inboundDedupeCache;
  if (cache.peek(key, opts?.now)) {
    return { status: "duplicate", key };
  }
  const inFlight = opts?.inFlight ?? inboundDedupeInFlight;
  if (inFlight.has(key)) {
    return { status: "inflight", key };
  }
  inFlight.add(key);
  return { status: "claimed", key };
}

/** Commit a claimed inbound key to the dedupe cache and release in-flight state. */
export function commitInboundDedupe(
  key: string,
  opts?: { cache?: DedupeCache; now?: number; inFlight?: Set<string> },
): void {
  const cache = opts?.cache ?? inboundDedupeCache;
  cache.check(key, opts?.now);
  const inFlight = opts?.inFlight ?? inboundDedupeInFlight;
  inFlight.delete(key);
}

/** Release an in-flight inbound key without committing it as processed. */
export function releaseInboundDedupe(key: string, opts?: { inFlight?: Set<string> }): void {
  const inFlight = opts?.inFlight ?? inboundDedupeInFlight;
  inFlight.delete(key);
}

/** Clear inbound dedupe cache and in-flight state for tests. */
export function resetInboundDedupe(): void {
  inboundDedupeCache.clear();
  inboundDedupeInFlight.clear();
}
