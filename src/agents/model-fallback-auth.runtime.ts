/** Runtime-safe auth-profile exports used by model fallback. */
export { resolveAuthProfileOrder } from "./auth-profiles/order.js";
/** Re-exported API for src/agents, starting with ensure Auth Profile Store. */
export { ensureAuthProfileStore, loadAuthProfileStoreForRuntime } from "./auth-profiles/store.js";
/** Re-exported API for src/agents. */
export {
  getSoonestCooldownExpiry,
  isProfileInCooldown,
  resolveProfilesUnavailableReason,
} from "./auth-profiles/usage.js";
