// Gateway client timeout constants and normalization helpers.
function parseStrictPositiveInteger(value: string): number | undefined {
  const trimmed = value.trim();
  if (!/^\+?\d+$/u.test(trimmed)) {
    return undefined;
  }
  const parsed = Number(trimmed);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined;
}

/** Largest delay Node timers can schedule without overflowing signed 32-bit range. */
export const MAX_SAFE_TIMEOUT_DELAY_MS = 2_147_483_647;
/** Default server-side preauth handshake watchdog. */
export const DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS = 15_000;
/** Minimum client challenge watchdog accepted after normalization. */
export const MIN_CONNECT_CHALLENGE_TIMEOUT_MS = 250;
/** Default upper bound for the connect challenge watchdog. */
export const MAX_CONNECT_CHALLENGE_TIMEOUT_MS = DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS;

/** Clamp timeout delays into the safe Node timer range and optional minimum. */
export function resolveSafeTimeoutDelayMs(delayMs: number, opts?: { minMs?: number }): number {
  const rawMinMs = opts?.minMs ?? 1;
  const minMs = Math.min(
    MAX_SAFE_TIMEOUT_DELAY_MS,
    Math.max(0, Number.isFinite(rawMinMs) ? Math.floor(rawMinMs) : 1),
  );
  const candidateMs = Number.isFinite(delayMs) ? Math.floor(delayMs) : minMs;
  return Math.min(MAX_SAFE_TIMEOUT_DELAY_MS, Math.max(minMs, candidateMs));
}

export function addSafeTimeoutDelayGraceMs(
  delayMs: number,
  graceMs: number,
  opts?: { minMs?: number },
): number {
  if (!Number.isFinite(delayMs) || !Number.isFinite(graceMs)) {
    return resolveSafeTimeoutDelayMs(MAX_SAFE_TIMEOUT_DELAY_MS, opts);
  }
  const withGrace = delayMs + graceMs;
  return resolveSafeTimeoutDelayMs(
    Number.isFinite(withGrace) ? withGrace : MAX_SAFE_TIMEOUT_DELAY_MS,
    opts,
  );
}

export function resolveFiniteTimeoutDelayMs(
  delayMs: number | null | undefined,
  fallbackMs: number,
  opts?: { minMs?: number },
): number {
  const candidateMs =
    typeof delayMs === "number" && Number.isFinite(delayMs) ? delayMs : fallbackMs;
  return resolveSafeTimeoutDelayMs(candidateMs, opts);
}

/** Clamp connect challenge timeout between protocol minimum and active maximum. */
export function clampConnectChallengeTimeoutMs(
  timeoutMs: number,
  maxTimeoutMs = MAX_CONNECT_CHALLENGE_TIMEOUT_MS,
): number {
  return Math.max(
    MIN_CONNECT_CHALLENGE_TIMEOUT_MS,
    Math.min(Math.max(MIN_CONNECT_CHALLENGE_TIMEOUT_MS, maxTimeoutMs), timeoutMs),
  );
}

/** Read the connect challenge timeout override from process-style env input. */
export function getConnectChallengeTimeoutMsFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): number | undefined {
  const raw = env.OPENCLAW_CONNECT_CHALLENGE_TIMEOUT_MS;
  if (raw) {
    const parsed = parseStrictPositiveInteger(raw);
    if (parsed !== undefined) {
      return resolveSafeTimeoutDelayMs(parsed);
    }
  }
  return undefined;
}

function normalizePositiveTimeoutMs(timeoutMs: unknown): number | undefined {
  return typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0
    ? resolveSafeTimeoutDelayMs(timeoutMs)
    : undefined;
}

/** Resolve the client challenge watchdog from explicit, env, and handshake settings. */
export function resolveConnectChallengeTimeoutMs(
  timeoutMs?: number | null,
  params?: {
    env?: NodeJS.ProcessEnv;
    configuredTimeoutMs?: number | null;
  },
): number {
  const configuredPreauthTimeoutMs = resolvePreauthHandshakeTimeoutMs({
    env: params?.env,
    configuredTimeoutMs: params?.configuredTimeoutMs,
  });
  // The client watchdog must never fire before the server-side preauth timeout.
  // Tests may raise the env override above that server default, so widen the cap.
  const maxTimeoutMs = Math.max(DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS, configuredPreauthTimeoutMs);
  if (typeof timeoutMs === "number" && Number.isFinite(timeoutMs)) {
    return clampConnectChallengeTimeoutMs(timeoutMs, maxTimeoutMs);
  }
  const envOverride = getConnectChallengeTimeoutMsFromEnv(params?.env);
  if (envOverride !== undefined) {
    return clampConnectChallengeTimeoutMs(envOverride, Math.max(maxTimeoutMs, envOverride));
  }
  return clampConnectChallengeTimeoutMs(configuredPreauthTimeoutMs, maxTimeoutMs);
}

/** Read the preauth handshake timeout from production or test env overrides. */
export function getPreauthHandshakeTimeoutMsFromEnv(env: NodeJS.ProcessEnv = process.env): number {
  const configuredTimeout =
    env.OPENCLAW_HANDSHAKE_TIMEOUT_MS || (env.VITEST && env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS);
  if (configuredTimeout) {
    const parsed = parseStrictPositiveInteger(configuredTimeout);
    if (parsed !== undefined) {
      return resolveSafeTimeoutDelayMs(parsed);
    }
  }
  return DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS;
}

/** Resolve preauth handshake timeout from env, configured value, or default. */
export function resolvePreauthHandshakeTimeoutMs(params?: {
  env?: NodeJS.ProcessEnv;
  configuredTimeoutMs?: number | null;
}): number {
  const env = params?.env ?? process.env;
  const configuredTimeout =
    env.OPENCLAW_HANDSHAKE_TIMEOUT_MS || (env.VITEST && env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS);
  if (configuredTimeout) {
    const parsed = parseStrictPositiveInteger(configuredTimeout);
    if (parsed !== undefined) {
      return resolveSafeTimeoutDelayMs(parsed);
    }
  }
  const configured = normalizePositiveTimeoutMs(params?.configuredTimeoutMs);
  if (configured !== undefined) {
    return configured;
  }
  return DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS;
}
