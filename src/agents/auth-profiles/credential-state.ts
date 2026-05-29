/** Evaluates whether stored auth profile credentials are usable. */
import { coerceSecretRef, normalizeSecretInputString } from "../../config/types.secrets.js";
import { MAX_DATE_TIMESTAMP_MS } from "../../shared/number-coercion.js";
import type { AuthProfileCredential, OAuthCredential } from "./types.js";

/** Shared type for Auth Credential Reason Code in src/agents/auth-profiles. */
export type AuthCredentialReasonCode =
  | "ok"
  | "missing_credential"
  | "invalid_expires"
  | "expired"
  | "unresolved_ref";

/** Reused constant for DEFAULT OAUTH REFRESH MARGIN MS behavior in src/agents/auth-profiles. */
export const DEFAULT_OAUTH_REFRESH_MARGIN_MS = 5 * 60 * 1000;

/** Shared type for Token Expiry State in src/agents/auth-profiles. */
export type TokenExpiryState = "missing" | "valid" | "expiring" | "expired" | "invalid_expires";

/** Classifies a token expiry timestamp relative to now and an optional refresh window. */
export function resolveTokenExpiryState(
  expires: unknown,
  now = Date.now(),
  opts?: {
    expiringWithinMs?: number;
  },
): TokenExpiryState {
  if (expires === undefined) {
    return "missing";
  }
  if (typeof expires !== "number") {
    return "invalid_expires";
  }
  if (!Number.isFinite(expires) || expires <= 0 || expires > MAX_DATE_TIMESTAMP_MS) {
    return "invalid_expires";
  }
  const remainingMs = expires - now;
  if (remainingMs <= 0) {
    return "expired";
  }
  const expiringWithinMs = Math.max(0, opts?.expiringWithinMs ?? 0);
  if (expiringWithinMs > 0 && remainingMs <= expiringWithinMs) {
    return "expiring";
  }
  return "valid";
}

/** Returns true when an OAuth access token exists and is not near expiry. */
export function hasUsableOAuthCredential(
  credential: OAuthCredential | undefined,
  opts?: {
    now?: number;
    refreshMarginMs?: number;
  },
): boolean {
  if (!credential || credential.type !== "oauth") {
    return false;
  }
  if (typeof credential.access !== "string" || credential.access.trim().length === 0) {
    return false;
  }
  const now = opts?.now ?? Date.now();
  const refreshMarginMs = Math.max(0, opts?.refreshMarginMs ?? DEFAULT_OAUTH_REFRESH_MARGIN_MS);
  return (
    resolveTokenExpiryState(credential.expires, now, {
      expiringWithinMs: refreshMarginMs,
    }) === "valid"
  );
}

function hasConfiguredSecretRef(value: unknown): boolean {
  return coerceSecretRef(value) !== null;
}

function hasConfiguredSecretString(value: unknown): boolean {
  return normalizeSecretInputString(value) !== undefined;
}

/** Checks whether a stored credential has enough material to be selected. */
export function evaluateStoredCredentialEligibility(params: {
  credential: AuthProfileCredential;
  now?: number;
}): { eligible: boolean; reasonCode: AuthCredentialReasonCode } {
  const now = params.now ?? Date.now();
  const credential = params.credential;

  if (credential.type === "api_key") {
    const hasKey = hasConfiguredSecretString(credential.key);
    const hasKeyRef = hasConfiguredSecretRef(credential.keyRef);
    if (!hasKey && !hasKeyRef) {
      return { eligible: false, reasonCode: "missing_credential" };
    }
    return { eligible: true, reasonCode: "ok" };
  }

  if (credential.type === "token") {
    const hasToken = hasConfiguredSecretString(credential.token);
    const hasTokenRef = hasConfiguredSecretRef(credential.tokenRef);
    if (!hasToken && !hasTokenRef) {
      return { eligible: false, reasonCode: "missing_credential" };
    }

    const expiryState = resolveTokenExpiryState(credential.expires, now);
    if (expiryState === "invalid_expires") {
      return { eligible: false, reasonCode: "invalid_expires" };
    }
    if (expiryState === "expired") {
      return { eligible: false, reasonCode: "expired" };
    }
    return { eligible: true, reasonCode: "ok" };
  }

  if (
    normalizeSecretInputString(credential.access) === undefined &&
    normalizeSecretInputString(credential.refresh) === undefined
  ) {
    return { eligible: false, reasonCode: "missing_credential" };
  }
  return { eligible: true, reasonCode: "ok" };
}
