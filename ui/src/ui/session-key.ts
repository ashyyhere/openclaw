// Session-key normalization for main agents, subagents, and legacy `main` UI
// aliases.
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalLowercaseString,
  normalizeOptionalString,
} from "./string-coerce.ts";

/** Parsed `agent:<agentId>:<rest>` session key components. */
export type ParsedAgentSessionKey = {
  agentId: string;
  rest: string;
};

/** Default Control UI agent id for legacy main-session routes. */
export const DEFAULT_AGENT_ID = "main";
/** Legacy main session key alias. */
export const DEFAULT_MAIN_KEY = "main";

const VALID_ID_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/i;
const INVALID_CHARS_RE = /[^a-z0-9_-]+/g;
const LEADING_DASH_RE = /^-+/;
const TRAILING_DASH_RE = /-+$/;

/** Parse an agent-scoped session key, returning null for legacy/unscoped keys. */
export function parseAgentSessionKey(
  sessionKey: string | undefined | null,
): ParsedAgentSessionKey | null {
  const raw = normalizeLowercaseStringOrEmpty(sessionKey);
  if (!raw) {
    return null;
  }
  const parts = raw.split(":").filter(Boolean);
  if (parts.length < 3 || parts[0] !== "agent") {
    return null;
  }
  const agentId = normalizeOptionalString(parts[1]);
  const rest = parts.slice(2).join(":");
  if (!agentId || !rest) {
    return null;
  }
  return { agentId, rest };
}

function normalizeMainKey(value: string | undefined | null): string {
  return normalizeOptionalLowercaseString(value) ?? DEFAULT_MAIN_KEY;
}

/** Normalize an agent id into the Control UI-safe id format. */
export function normalizeAgentId(value: string | undefined | null): string {
  const trimmed = normalizeOptionalString(value) ?? "";
  if (!trimmed) {
    return DEFAULT_AGENT_ID;
  }
  if (VALID_ID_RE.test(trimmed)) {
    return normalizeLowercaseStringOrEmpty(trimmed);
  }
  return (
    normalizeLowercaseStringOrEmpty(trimmed)
      .replace(INVALID_CHARS_RE, "-")
      .replace(LEADING_DASH_RE, "")
      .replace(TRAILING_DASH_RE, "")
      .slice(0, 64) || DEFAULT_AGENT_ID
  );
}

/** Build the canonical main session key for an agent. */
export function buildAgentMainSessionKey(params: {
  agentId: string;
  mainKey?: string | undefined;
}): string {
  const agentId = normalizeAgentId(params.agentId);
  const mainKey = normalizeMainKey(params.mainKey);
  return `agent:${agentId}:${mainKey}`;
}

function normalizeDefaultMainSessionAliasForUi(sessionKey: string | undefined | null): string {
  const normalized = normalizeLowercaseStringOrEmpty(sessionKey);
  return normalized === DEFAULT_MAIN_KEY
    ? buildAgentMainSessionKey({ agentId: DEFAULT_AGENT_ID, mainKey: DEFAULT_MAIN_KEY })
    : normalized;
}

/** Compare session keys while treating legacy `main` as the main-agent key. */
export function areUiSessionKeysEquivalent(
  left: string | undefined | null,
  right: string | undefined | null,
): boolean {
  const normalizedLeft = normalizeDefaultMainSessionAliasForUi(left);
  const normalizedRight = normalizeDefaultMainSessionAliasForUi(right);
  return Boolean(normalizedLeft && normalizedRight && normalizedLeft === normalizedRight);
}

/** Resolve the owning agent id from a session key, defaulting to main. */
export function resolveAgentIdFromSessionKey(sessionKey: string | undefined | null): string {
  const parsed = parseAgentSessionKey(sessionKey);
  return normalizeAgentId(parsed?.agentId ?? DEFAULT_AGENT_ID);
}

/** Return true when a UI session key points at a subagent session. */
export function isSubagentSessionKey(sessionKey: string | undefined | null): boolean {
  const raw = normalizeOptionalString(sessionKey) ?? "";
  if (!raw) {
    return false;
  }
  if (normalizeLowercaseStringOrEmpty(raw).startsWith("subagent:")) {
    return true;
  }
  const parsed = parseAgentSessionKey(raw);
  return normalizeLowercaseStringOrEmpty(parsed?.rest).startsWith("subagent:");
}
