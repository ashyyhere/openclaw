/** Resolves auth profile, legacy auth, state, and OAuth lock paths. */
import { createHash } from "node:crypto";
import path from "node:path";
import { resolveStateDir } from "../../config/paths.js";
import { resolveUserPath } from "../../utils.js";
import { resolveDefaultAgentDir } from "../agent-scope-config.js";
import {
  AUTH_PROFILE_FILENAME,
  AUTH_STATE_FILENAME,
  LEGACY_AUTH_FILENAME,
} from "./path-constants.js";

/** Resolves the auth profile store path for an agent directory. */
export function resolveAuthStorePath(agentDir?: string): string {
  const resolved = resolveUserPath(agentDir ?? resolveDefaultAgentDir({}));
  return path.join(resolved, AUTH_PROFILE_FILENAME);
}

/** Resolves the legacy auth.json path for migration. */
export function resolveLegacyAuthStorePath(agentDir?: string): string {
  const resolved = resolveUserPath(agentDir ?? resolveDefaultAgentDir({}));
  return path.join(resolved, LEGACY_AUTH_FILENAME);
}

/** Resolves the auth state sidecar path for mutable usage/order state. */
export function resolveAuthStatePath(agentDir?: string): string {
  const resolved = resolveUserPath(agentDir ?? resolveDefaultAgentDir({}));
  return path.join(resolved, AUTH_STATE_FILENAME);
}

/** Reused helper for resolve Auth Store Path For Display behavior in src/agents/auth-profiles. */
export function resolveAuthStorePathForDisplay(agentDir?: string): string {
  const pathname = resolveAuthStorePath(agentDir);
  return pathname.startsWith("~") ? pathname : resolveUserPath(pathname);
}

/** Reused helper for resolve Auth State Path For Display behavior in src/agents/auth-profiles. */
export function resolveAuthStatePathForDisplay(agentDir?: string): string {
  const pathname = resolveAuthStatePath(agentDir);
  return pathname.startsWith("~") ? pathname : resolveUserPath(pathname);
}

/**
 * Resolve the path of the cross-agent, per-profile OAuth refresh coordination
 * lock. The filename hashes `provider\0profileId` so it is filesystem-safe
 * for arbitrary unicode/control-character inputs and always bounded in
 * length. The NUL separator makes it impossible to collide two distinct
 * `(provider, profileId)` pairs by string concatenation.
 *
 * This lock is the serialization point that prevents the `refresh_token_reused`
 * storm when N agents share one OAuth profile (see issue #26322): every agent
 * that attempts a refresh acquires this same file lock, so only one HTTP
 * refresh is in-flight at a time and peers can adopt the resulting fresh
 * credentials instead of racing against a single-use refresh token.
 *
 * The key intentionally includes `provider` so that two profiles that
 * happen to share a `profileId` across providers (operator-renamed profile,
 * test fixture, etc.) do not needlessly serialize against each other.
 */
export function resolveOAuthRefreshLockPath(provider: string, profileId: string): string {
  const hash = createHash("sha256");
  // This hashes provider/profile identifiers into a path-safe lock name; it is
  // not password storage or credential verification.
  // codeql[js/insufficient-password-hash]
  hash.update(provider, "utf8");
  hash.update("\u0000", "utf8"); // NUL separator: unambiguous boundary.
  hash.update(profileId, "utf8");
  const safeId = `sha256-${hash.digest("hex")}`;
  return path.join(resolveStateDir(), "locks", "oauth-refresh", safeId);
}
