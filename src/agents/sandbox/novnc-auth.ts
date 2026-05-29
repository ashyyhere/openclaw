/** Issues noVNC passwords and observer tokens for sandbox browsers. */
import crypto from "node:crypto";
import {
  isFutureDateTimestampMs,
  resolveExpiresAtMsFromDurationMs,
} from "../../shared/number-coercion.js";
import { normalizeOptionalString } from "../../shared/string-coerce.js";

/** Reused constant for NOVNC PASSWORD ENV KEY behavior in src/agents/sandbox. */
export const NOVNC_PASSWORD_ENV_KEY = "OPENCLAW_BROWSER_NOVNC_PASSWORD"; // pragma: allowlist secret
const NOVNC_TOKEN_TTL_MS = 60 * 1000;
const MAX_NOVNC_TOKEN_TTL_MS = NOVNC_TOKEN_TTL_MS;
const NOVNC_PASSWORD_LENGTH = 8;
const NOVNC_PASSWORD_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

type NoVncObserverTokenEntry = {
  noVncPort: number;
  password?: string;
  expiresAt: number;
};

/** Shared type for No Vnc Observer Token Payload in src/agents/sandbox. */
export type NoVncObserverTokenPayload = {
  noVncPort: number;
  password?: string;
};

const NO_VNC_OBSERVER_TOKENS = new Map<string, NoVncObserverTokenEntry>();

function pruneExpiredNoVncObserverTokens(now: number) {
  for (const [token, entry] of NO_VNC_OBSERVER_TOKENS) {
    if (!isFutureDateTimestampMs(entry.expiresAt, { nowMs: now })) {
      NO_VNC_OBSERVER_TOKENS.delete(token);
    }
  }
}

function resolveNoVncObserverTokenExpiresAt(params: { ttlMs?: number; nowMs: number }) {
  return (
    resolveExpiresAtMsFromDurationMs(params.ttlMs, {
      nowMs: params.nowMs,
      minRemainingMs: 1,
    }) ??
    resolveExpiresAtMsFromDurationMs(NOVNC_TOKEN_TTL_MS, {
      nowMs: params.nowMs,
      minRemainingMs: 1,
    })
  );
}

/** Returns whether noVNC should be exposed for a browser config. */
export function isNoVncEnabled(params: { enableNoVnc: boolean; headless: boolean }) {
  return params.enableNoVnc && !params.headless;
}

/** Generates a short random noVNC password for a browser session. */
export function generateNoVncPassword() {
  // VNC auth uses an 8-char password max.
  let out = "";
  for (let i = 0; i < NOVNC_PASSWORD_LENGTH; i += 1) {
    out += NOVNC_PASSWORD_ALPHABET[crypto.randomInt(0, NOVNC_PASSWORD_ALPHABET.length)];
  }
  return out;
}

/** Builds the direct localhost noVNC URL for a mapped port. */
export function buildNoVncDirectUrl(port: number) {
  return `http://127.0.0.1:${port}/vnc.html`;
}

/** Builds the target URL encoded inside an observer token. */
export function buildNoVncObserverTargetUrl(params: { port: number; password?: string }) {
  const query = new URLSearchParams({
    autoconnect: "1",
    resize: "remote",
  });
  if (params.password?.trim()) {
    query.set("password", params.password);
  }
  return `${buildNoVncDirectUrl(params.port)}#${query.toString()}`;
}

/** Issues a short-lived observer token for a noVNC target URL. */
export function issueNoVncObserverToken(params: {
  noVncPort: number;
  password?: string;
  ttlMs?: number;
  nowMs?: number;
}): string {
  const now = params.nowMs ?? Date.now();
  pruneExpiredNoVncObserverTokens(now);
  const token = crypto.randomBytes(24).toString("hex");
  const requestedTtlMs =
    typeof params.ttlMs === "number" && params.ttlMs <= MAX_NOVNC_TOKEN_TTL_MS
      ? params.ttlMs
      : undefined;
  const expiresAt = resolveNoVncObserverTokenExpiresAt({
    ttlMs: requestedTtlMs,
    nowMs: now,
  });
  if (expiresAt === undefined) {
    return token;
  }
  NO_VNC_OBSERVER_TOKENS.set(token, {
    noVncPort: params.noVncPort,
    password: normalizeOptionalString(params.password),
    expiresAt,
  });
  return token;
}

/** Consumes and validates a noVNC observer token. */
export function consumeNoVncObserverToken(
  token: string,
  nowMs?: number,
): NoVncObserverTokenPayload | null {
  const now = nowMs ?? Date.now();
  pruneExpiredNoVncObserverTokens(now);
  const normalized = token.trim();
  if (!normalized) {
    return null;
  }
  const entry = NO_VNC_OBSERVER_TOKENS.get(normalized);
  if (!entry) {
    return null;
  }
  NO_VNC_OBSERVER_TOKENS.delete(normalized);
  if (!isFutureDateTimestampMs(entry.expiresAt, { nowMs: now })) {
    return null;
  }
  return { noVncPort: entry.noVncPort, password: entry.password };
}

/** Builds the public observer URL that carries an issued token. */
export function buildNoVncObserverTokenUrl(baseUrl: string, token: string) {
  const query = new URLSearchParams({ token });
  return `${baseUrl}/sandbox/novnc?${query.toString()}`;
}

/** Clears observer tokens for isolated tests. */
export function resetNoVncObserverTokensForTests() {
  NO_VNC_OBSERVER_TOKENS.clear();
}
