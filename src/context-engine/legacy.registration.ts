// context-engine legacy registration helpers and runtime behavior.
import { LegacyContextEngine } from "./legacy.js";
import { registerContextEngineForOwner } from "./registry.js";

/** Reused helper for register Legacy Context Engine behavior in src/context-engine. */
export function registerLegacyContextEngine(): void {
  registerContextEngineForOwner("legacy", async () => new LegacyContextEngine(), "core", {
    allowSameOwnerRefresh: true,
  });
}
