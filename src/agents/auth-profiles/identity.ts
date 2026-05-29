/** Resolves stable auth profile identity metadata from config and credentials. */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { normalizeOptionalString } from "../../shared/string-coerce.js";
import type { AuthProfileStore } from "./types.js";

function resolveStoredMetadata(store: AuthProfileStore | undefined, profileId: string) {
  const profile = store?.profiles[profileId];
  if (!profile) {
    return {};
  }
  return {
    displayName:
      "displayName" in profile ? normalizeOptionalString(profile.displayName) : undefined,
    email: "email" in profile ? normalizeOptionalString(profile.email) : undefined,
  };
}

/** Reused helper for build Auth Profile Id behavior in src/agents/auth-profiles. */
export function buildAuthProfileId(params: {
  providerId: string;
  profileName?: string | null;
  profilePrefix?: string;
}): string {
  const profilePrefix = normalizeOptionalString(params.profilePrefix) ?? params.providerId;
  const profileName = normalizeOptionalString(params.profileName) ?? "default";
  return `${profilePrefix}:${profileName}`;
}

/** Reused helper for resolve Auth Profile Metadata behavior in src/agents/auth-profiles. */
export function resolveAuthProfileMetadata(params: {
  cfg?: OpenClawConfig;
  store?: AuthProfileStore;
  profileId: string;
}): { displayName?: string; email?: string } {
  const configured = params.cfg?.auth?.profiles?.[params.profileId];
  const stored = resolveStoredMetadata(params.store, params.profileId);
  return {
    displayName: normalizeOptionalString(configured?.displayName) ?? stored.displayName,
    email: normalizeOptionalString(configured?.email) ?? stored.email,
  };
}
