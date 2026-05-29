/** Clones auth profile stores without sharing mutable nested state. */
import type { AuthProfileStore } from "./types.js";

/** Reused helper for clone Auth Profile Store behavior in src/agents/auth-profiles. */
export function cloneAuthProfileStore(store: AuthProfileStore): AuthProfileStore {
  return JSON.parse(
    JSON.stringify(store, (_key, value: unknown) => {
      if (typeof value === "bigint" || typeof value === "function" || typeof value === "symbol") {
        throw new TypeError(`AuthProfileStore contains non-JSON value: ${typeof value}`);
      }
      return value;
    }),
  ) as AuthProfileStore;
}
