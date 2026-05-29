/** Runtime wrapper for auth-profile store loading. */
import { ensureAuthProfileStore as ensureAuthProfileStoreImpl } from "./auth-profiles/store.js";

type EnsureAuthProfileStore = typeof import("./auth-profiles/store.js").ensureAuthProfileStore;

/** Forward to the runtime auth-profile store loader. */
export function ensureAuthProfileStore(
  ...args: Parameters<EnsureAuthProfileStore>
): ReturnType<EnsureAuthProfileStore> {
  return ensureAuthProfileStoreImpl(...args);
}
