/** Lists and de-duplicates auth profile ids by provider. */
import { uniqueStrings } from "../../shared/string-normalization.js";
import { resolveProviderIdForAuth } from "../provider-auth-aliases.js";
import type { AuthProfileStore } from "./types.js";

/** Reused helper for dedupe Profile Ids behavior in src/agents/auth-profiles. */
export function dedupeProfileIds(profileIds: string[]): string[] {
  return uniqueStrings(profileIds);
}

/** Reused helper for list Profiles For Provider behavior in src/agents/auth-profiles. */
export function listProfilesForProvider(store: AuthProfileStore, provider: string): string[] {
  const providerKey = resolveProviderIdForAuth(provider);
  return Object.entries(store.profiles)
    .filter(([, cred]) => resolveProviderIdForAuth(cred.provider) === providerKey)
    .map(([id]) => id);
}
