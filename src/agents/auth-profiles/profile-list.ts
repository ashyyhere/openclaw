/** Lists and de-duplicates auth profile ids by provider. */
import { uniqueStrings } from "../../shared/string-normalization.js";
import { resolveProviderIdForAuth } from "../provider-auth-aliases.js";
import type { AuthProfileStore } from "./types.js";

/** De-duplicates auth profile ids while preserving order. */
export function dedupeProfileIds(profileIds: string[]): string[] {
  return uniqueStrings(profileIds);
}

/** Lists auth profile ids whose stored provider matches the requested provider. */
export function listProfilesForProvider(store: AuthProfileStore, provider: string): string[] {
  const providerKey = resolveProviderIdForAuth(provider);
  return Object.entries(store.profiles)
    .filter(([, cred]) => resolveProviderIdForAuth(cred.provider) === providerKey)
    .map(([id]) => id);
}
