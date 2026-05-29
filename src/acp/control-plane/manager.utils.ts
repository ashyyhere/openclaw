/** Utility helpers for ACP session keys, errors, metadata, and runtime TTLs. */
import {
  canonicalizeMainSessionAlias,
  resolveMainSessionKey,
} from "../../config/sessions/main-session.js";
import type { SessionAcpMeta } from "../../config/sessions/types.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import {
  normalizeAgentId,
  normalizeMainKey,
  parseAgentSessionKey,
} from "../../routing/session-key.js";
import { normalizeLowercaseStringOrEmpty } from "../../shared/string-coerce.js";
import { ACP_ERROR_CODES, AcpRuntimeError } from "../runtime/errors.js";
import type { AcpSessionResolution } from "./manager.types.js";

/** Reused helper for resolve Acp Agent From Session Key behavior in src/acp/control-plane. */
export function resolveAcpAgentFromSessionKey(sessionKey: string, fallback = "main"): string {
  const parsed = parseAgentSessionKey(sessionKey);
  return normalizeAgentId(parsed?.agentId ?? fallback);
}

/** Reused helper for resolve Missing Meta Error behavior in src/acp/control-plane. */
export function resolveMissingMetaError(sessionKey: string): AcpRuntimeError {
  return new AcpRuntimeError(
    "ACP_SESSION_INIT_FAILED",
    `ACP metadata is missing for ${sessionKey}. Recreate this ACP session with /acp spawn and rebind the thread.`,
  );
}

/** Reused helper for resolve Acp Session Resolution Error behavior in src/acp/control-plane. */
export function resolveAcpSessionResolutionError(
  resolution: AcpSessionResolution,
): AcpRuntimeError | null {
  if (resolution.kind === "ready") {
    return null;
  }
  if (resolution.kind === "stale") {
    return resolution.error;
  }
  return new AcpRuntimeError(
    "ACP_SESSION_INIT_FAILED",
    `Session is not ACP-enabled: ${resolution.sessionKey}`,
  );
}

/** Reused helper for require Ready Session Meta behavior in src/acp/control-plane. */
export function requireReadySessionMeta(resolution: AcpSessionResolution): SessionAcpMeta {
  if (resolution.kind === "ready") {
    return resolution.meta;
  }
  throw resolveAcpSessionResolutionError(resolution);
}

function normalizeSessionKey(sessionKey: string): string {
  return sessionKey.trim();
}

/** Reused helper for canonicalize Acp Session Key behavior in src/acp/control-plane. */
export function canonicalizeAcpSessionKey(params: {
  cfg: OpenClawConfig;
  sessionKey: string;
}): string {
  const normalized = normalizeSessionKey(params.sessionKey);
  if (!normalized) {
    return "";
  }
  const lowered = normalizeLowercaseStringOrEmpty(normalized);
  if (lowered === "global" || lowered === "unknown") {
    return lowered;
  }
  const parsed = parseAgentSessionKey(lowered);
  if (parsed) {
    return canonicalizeMainSessionAlias({
      cfg: params.cfg,
      agentId: parsed.agentId,
      sessionKey: lowered,
    });
  }
  const mainKey = normalizeMainKey(params.cfg.session?.mainKey);
  if (lowered === "main" || lowered === mainKey) {
    return resolveMainSessionKey(params.cfg);
  }
  return lowered;
}

/** Reused helper for normalize Actor Key behavior in src/acp/control-plane. */
export function normalizeActorKey(sessionKey: string): string {
  return normalizeLowercaseStringOrEmpty(sessionKey);
}

/** Reused helper for normalize Acp Error Code behavior in src/acp/control-plane. */
export function normalizeAcpErrorCode(code: string | undefined): AcpRuntimeError["code"] {
  if (!code) {
    return "ACP_TURN_FAILED";
  }
  const normalized = code.trim().toUpperCase();
  for (const allowed of ACP_ERROR_CODES) {
    if (allowed === normalized) {
      return allowed;
    }
  }
  return "ACP_TURN_FAILED";
}

/** Reused helper for create Unsupported Control Error behavior in src/acp/control-plane. */
export function createUnsupportedControlError(params: {
  backend: string;
  control: string;
}): AcpRuntimeError {
  return new AcpRuntimeError(
    "ACP_BACKEND_UNSUPPORTED_CONTROL",
    `ACP backend "${params.backend}" does not support ${params.control}.`,
  );
}

/** Reused helper for resolve Runtime Idle Ttl Ms behavior in src/acp/control-plane. */
export function resolveRuntimeIdleTtlMs(cfg: OpenClawConfig): number {
  const ttlMinutes = cfg.acp?.runtime?.ttlMinutes;
  if (typeof ttlMinutes !== "number" || !Number.isFinite(ttlMinutes) || ttlMinutes <= 0) {
    return 0;
  }
  return Math.round(ttlMinutes * 60 * 1000);
}

/** Reused helper for has Legacy Acp Identity Projection behavior in src/acp/control-plane. */
export function hasLegacyAcpIdentityProjection(meta: SessionAcpMeta): boolean {
  const raw = meta as Record<string, unknown>;
  return (
    Object.hasOwn(raw, "backendSessionId") ||
    Object.hasOwn(raw, "agentSessionId") ||
    Object.hasOwn(raw, "sessionIdsProvisional")
  );
}
