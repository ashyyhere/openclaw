// gateway model pricing config helpers and runtime behavior.
import type { OpenClawConfig } from "../config/types.openclaw.js";

/** Reused helper for is Gateway Model Pricing Enabled behavior in src/gateway. */
export function isGatewayModelPricingEnabled(config: OpenClawConfig): boolean {
  return config.models?.pricing?.enabled !== false;
}
