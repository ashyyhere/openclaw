/** Runtime-safe auth-profile exports used by model fallback. */
export { resolveAuthProfileOrder } from "./auth-profiles/order.js";
/** Runtime auth-profile store loaders used by model fallback. */
export { ensureAuthProfileStore, loadAuthProfileStoreForRuntime } from "./auth-profiles/store.js";
/** Auth-profile cooldown helpers used by fallback routing. */
export {
  getSoonestCooldownExpiry,
  isProfileInCooldown,
  resolveProfilesUnavailableReason,
} from "./auth-profiles/usage.js";
