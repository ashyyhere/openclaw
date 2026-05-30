// Canonical builders and normalizers for routing session keys across agents,
// channels, peers, cron runs, and threaded conversations.
import type { ChatType } from "../channels/chat-type.js";
import {
  isCronRunSessionKey,
  normalizeSessionPeerId,
  normalizeSessionKeyPreservingOpaquePeerIds,
  parseAgentSessionKey,
} from "../sessions/session-key-utils.js";
import { normalizeLowercaseStringOrEmpty } from "../shared/string-coerce.js";
import { normalizeAccountId } from "./account-id.js";

/** Exposes parser helpers from the canonical session-key utility module. */
export {
  getSubagentDepth,
  isCronSessionKey,
  isAcpSessionKey,
  isSubagentSessionKey,
  parseAgentSessionKey,
  parseThreadSessionSuffix,
  type ParsedAgentSessionKey,
} from "../sessions/session-key-utils.js";
/** Exposes account-id helpers beside routing key builders for callers. */
export {
  DEFAULT_ACCOUNT_ID,
  normalizeAccountId,
  normalizeOptionalAccountId,
} from "./account-id.js";

/** Agent id used when callers omit explicit multi-agent routing. */
export const DEFAULT_AGENT_ID = "main";
/** Conversation key used for an agent's default wake and store queue. */
export const DEFAULT_MAIN_KEY = "main";
/** Coarse shape classification for migration and request-boundary handling. */
export type SessionKeyShape = "missing" | "agent" | "legacy_or_alias" | "malformed_agent";

// Pre-compiled regex
const VALID_ID_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/i;
const INVALID_CHARS_RE = /[^a-z0-9_-]+/g;
const LEADING_DASH_RE = /^-+/;
const TRAILING_DASH_RE = /-+$/;

function normalizeToken(value: string | undefined | null): string {
  return normalizeLowercaseStringOrEmpty(value);
}

/** Scopes heartbeat wake options to the queue that can actually drain them. */
export function scopedHeartbeatWakeOptions<T extends object>(
  sessionKey: string,
  wakeOptions: T,
  mainKey?: string,
  scope?: "per-sender" | "global",
): T | (T & { sessionKey: string }) | (T & { agentId: string }) {
  const parsed = parseAgentSessionKey(sessionKey);
  if (!parsed) {
    return wakeOptions;
  }
  if (isCronRunSessionKey(sessionKey)) {
    // Global-scope agents drain the literal "global" queue, not agent-main;
    // a targeted wake on agent:<id>:main would be unresolvable. Drop the
    // sessionKey but carry the agent target so multi-agent global-scope
    // setups still wake the originating agent's heartbeat.
    if (scope === "global") {
      return { ...wakeOptions, agentId: parsed.agentId };
    }
    return {
      ...wakeOptions,
      sessionKey: buildAgentMainSessionKey({ agentId: parsed.agentId, mainKey }),
    };
  }
  return { ...wakeOptions, sessionKey };
}

/** Converts cron-run event keys to the persistent queue key used by the agent. */
export function resolveEventSessionKey(
  sessionKey: string,
  mainKey?: string,
  scope?: "per-sender" | "global",
): string {
  const parsed = parseAgentSessionKey(sessionKey);
  if (!parsed || !isCronRunSessionKey(sessionKey)) {
    return sessionKey;
  }
  // Global-scope agents enqueue/drain via the literal "global" queue; agent-main
  // would strand the event in a queue the heartbeat never peeks.
  if (scope === "global") {
    return "global";
  }
  return buildAgentMainSessionKey({ agentId: parsed.agentId, mainKey });
}

/** Normalizes the default conversation key while preserving the main fallback. */
export function normalizeMainKey(value: string | undefined | null): string {
  return normalizeLowercaseStringOrEmpty(value) || DEFAULT_MAIN_KEY;
}

/** Strips the agent prefix before exposing a store key back to request callers. */
export function toAgentRequestSessionKey(storeKey: string | undefined | null): string | undefined {
  const raw = (storeKey ?? "").trim();
  if (!raw) {
    return undefined;
  }
  return parseAgentSessionKey(raw)?.rest ?? raw;
}

/** Converts request-visible keys into canonical agent-prefixed store keys. */
export function toAgentStoreSessionKey(params: {
  agentId: string;
  requestKey: string | undefined | null;
  mainKey?: string | undefined;
}): string {
  const raw = (params.requestKey ?? "").trim();
  const lowered = normalizeLowercaseStringOrEmpty(raw);
  if (!raw || lowered === DEFAULT_MAIN_KEY) {
    return buildAgentMainSessionKey({ agentId: params.agentId, mainKey: params.mainKey });
  }
  const parsed = parseAgentSessionKey(raw);
  if (parsed) {
    return `agent:${parsed.agentId}:${parsed.rest}`;
  }
  const normalized = normalizeSessionKeyPreservingOpaquePeerIds(raw);
  if (lowered.startsWith("agent:")) {
    return normalized;
  }
  return `agent:${normalizeAgentId(params.agentId)}:${normalized}`;
}

/** Reads the owning agent id from a session key, falling back to the main agent. */
export function resolveAgentIdFromSessionKey(sessionKey: string | undefined | null): string {
  const parsed = parseAgentSessionKey(sessionKey);
  return normalizeAgentId(parsed?.agentId ?? DEFAULT_AGENT_ID);
}

/** Classifies user-provided keys before legacy scoping or malformed-agent checks. */
export function classifySessionKeyShape(sessionKey: string | undefined | null): SessionKeyShape {
  const raw = (sessionKey ?? "").trim();
  if (!raw) {
    return "missing";
  }
  if (parseAgentSessionKey(raw)) {
    return "agent";
  }
  return normalizeLowercaseStringOrEmpty(raw).startsWith("agent:")
    ? "malformed_agent"
    : "legacy_or_alias";
}

/** Detects sentinel queues that are intentionally not scoped to an agent. */
export function isUnscopedSessionKeySentinel(sessionKey: string | undefined | null): boolean {
  const lowered = normalizeLowercaseStringOrEmpty(sessionKey);
  return lowered === "global" || lowered === "unknown";
}

/** Adds an agent prefix to legacy keys without rewriting already-scoped keys. */
export function scopeLegacySessionKeyToAgent(params: {
  agentId?: string | undefined;
  sessionKey?: string | undefined;
  mainKey?: string | undefined;
}): string | undefined {
  const raw = (params.sessionKey ?? "").trim();
  if (!raw) {
    return undefined;
  }
  const agentId = params.agentId?.trim();
  if (!agentId || classifySessionKeyShape(raw) !== "legacy_or_alias") {
    return raw;
  }
  return toAgentStoreSessionKey({
    agentId,
    requestKey: raw,
    mainKey: params.mainKey,
  });
}

/** Normalizes agent ids to the path-safe token used in store and queue keys. */
export function normalizeAgentId(value: string | undefined | null): string {
  const trimmed = (value ?? "").trim();
  if (!trimmed) {
    return DEFAULT_AGENT_ID;
  }
  const normalized = normalizeLowercaseStringOrEmpty(trimmed);
  // Keep it path-safe + shell-friendly.
  if (VALID_ID_RE.test(trimmed)) {
    return normalized;
  }
  // Best-effort fallback: collapse invalid characters to "-"
  return (
    normalized
      .replace(INVALID_CHARS_RE, "-")
      .replace(LEADING_DASH_RE, "")
      .replace(TRAILING_DASH_RE, "")
      .slice(0, 64) || DEFAULT_AGENT_ID
  );
}

/** Checks whether an agent id already satisfies the routing token contract. */
export function isValidAgentId(value: string | undefined | null): boolean {
  const trimmed = (value ?? "").trim();
  return Boolean(trimmed) && VALID_ID_RE.test(trimmed);
}

/** Public alias for normalizing user-provided agent ids at config boundaries. */
export function sanitizeAgentId(value: string | undefined | null): string {
  return normalizeAgentId(value);
}

/** Builds the canonical queue key for an agent's default conversation. */
export function buildAgentMainSessionKey(params: {
  agentId: string;
  mainKey?: string | undefined;
}): string {
  const agentId = normalizeAgentId(params.agentId);
  const mainKey = normalizeMainKey(params.mainKey);
  return `agent:${agentId}:${mainKey}`;
}

/** Builds the agent-scoped key for a DM, group, channel, or peer conversation. */
export function buildAgentPeerSessionKey(params: {
  agentId: string;
  mainKey?: string | undefined;
  channel: string;
  accountId?: string | null;
  peerKind?: ChatType | null;
  peerId?: string | null;
  identityLinks?: Record<string, string[]>;
  /** DM session scope. */
  dmScope?: "main" | "per-peer" | "per-channel-peer" | "per-account-channel-peer";
}): string {
  const peerKind = params.peerKind ?? "direct";
  if (peerKind === "direct") {
    const dmScope = params.dmScope ?? "main";
    let peerId = (params.peerId ?? "").trim();
    const linkedPeerId =
      dmScope === "main"
        ? null
        : resolveLinkedPeerId({
            identityLinks: params.identityLinks,
            channel: params.channel,
            peerId,
          });
    if (linkedPeerId) {
      peerId = linkedPeerId;
    }
    peerId = normalizeLowercaseStringOrEmpty(peerId);
    if (dmScope === "per-account-channel-peer" && peerId) {
      const channel = normalizeLowercaseStringOrEmpty(params.channel) || "unknown";
      const accountId = normalizeAccountId(params.accountId);
      return `agent:${normalizeAgentId(params.agentId)}:${channel}:${accountId}:direct:${peerId}`;
    }
    if (dmScope === "per-channel-peer" && peerId) {
      const channel = normalizeLowercaseStringOrEmpty(params.channel) || "unknown";
      return `agent:${normalizeAgentId(params.agentId)}:${channel}:direct:${peerId}`;
    }
    if (dmScope === "per-peer" && peerId) {
      return `agent:${normalizeAgentId(params.agentId)}:direct:${peerId}`;
    }
    return buildAgentMainSessionKey({
      agentId: params.agentId,
      mainKey: params.mainKey,
    });
  }
  const channel = normalizeLowercaseStringOrEmpty(params.channel) || "unknown";
  const peerId =
    normalizeSessionPeerId({
      channel: params.channel,
      peerKind,
      peerId: params.peerId,
    }) || "unknown";
  return `agent:${normalizeAgentId(params.agentId)}:${channel}:${peerKind}:${peerId}`;
}

function resolveLinkedPeerId(params: {
  identityLinks?: Record<string, string[]>;
  channel: string;
  peerId: string;
}): string | null {
  const identityLinks = params.identityLinks;
  if (!identityLinks) {
    return null;
  }
  const peerId = params.peerId.trim();
  if (!peerId) {
    return null;
  }
  const candidates = new Set<string>();
  const rawCandidate = normalizeToken(peerId);
  if (rawCandidate) {
    candidates.add(rawCandidate);
  }
  const channel = normalizeToken(params.channel);
  if (channel) {
    const scopedCandidate = normalizeToken(`${channel}:${peerId}`);
    if (scopedCandidate) {
      candidates.add(scopedCandidate);
    }
  }
  if (candidates.size === 0) {
    return null;
  }
  for (const [canonical, ids] of Object.entries(identityLinks)) {
    const canonicalName = canonical.trim();
    if (!canonicalName) {
      continue;
    }
    if (!Array.isArray(ids)) {
      continue;
    }
    for (const id of ids) {
      const normalized = normalizeToken(id);
      if (normalized && candidates.has(normalized)) {
        return canonicalName;
      }
    }
  }
  return null;
}

/** Builds the durable history key shared by group/channel backfill lookups. */
export function buildGroupHistoryKey(params: {
  channel: string;
  accountId?: string | null;
  peerKind: "group" | "channel";
  peerId: string;
}): string {
  const channel = normalizeToken(params.channel) || "unknown";
  const accountId = normalizeAccountId(params.accountId);
  const peerId =
    normalizeSessionPeerId({
      channel,
      peerKind: params.peerKind,
      peerId: params.peerId,
    }) || "unknown";
  return `${channel}:${accountId}:${params.peerKind}:${peerId}`;
}

/** Derives child thread keys while keeping the parent key available to callers. */
export function resolveThreadSessionKeys(params: {
  baseSessionKey: string;
  threadId?: string | null;
  parentSessionKey?: string;
  useSuffix?: boolean;
  normalizeThreadId?: (threadId: string) => string;
}): { sessionKey: string; parentSessionKey?: string } {
  const threadId = (params.threadId ?? "").trim();
  if (!threadId) {
    return { sessionKey: params.baseSessionKey, parentSessionKey: undefined };
  }
  const normalizedThread =
    params.normalizeThreadId?.(threadId) ?? normalizeLowercaseStringOrEmpty(threadId);
  const useSuffix = params.useSuffix ?? true;
  const sessionKey = useSuffix
    ? `${params.baseSessionKey}:thread:${normalizedThread}`
    : params.baseSessionKey;
  return { sessionKey, parentSessionKey: params.parentSessionKey };
}
