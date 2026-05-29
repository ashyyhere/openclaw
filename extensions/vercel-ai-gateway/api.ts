// extensions/vercel-ai-gateway api helpers and runtime behavior.
/** Re-exported vercel-ai-gateway plugin public API. */
export {
  discoverVercelAiGatewayModels,
  getStaticVercelAiGatewayModelCatalog,
  VERCEL_AI_GATEWAY_BASE_URL,
  VERCEL_AI_GATEWAY_DEFAULT_CONTEXT_WINDOW,
  VERCEL_AI_GATEWAY_DEFAULT_COST,
  VERCEL_AI_GATEWAY_DEFAULT_MAX_TOKENS,
  VERCEL_AI_GATEWAY_DEFAULT_MODEL_ID,
  VERCEL_AI_GATEWAY_PROVIDER_ID,
} from "./models.js";
/** Re-exported vercel-ai-gateway plugin public API, starting with build Vercel Ai Gateway Provider. */
export { buildVercelAiGatewayProvider } from "./provider-catalog.js";
/** Re-exported vercel-ai-gateway plugin public API, starting with apply Vercel Ai Gateway Config. */
export { applyVercelAiGatewayConfig, VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF } from "./onboard.js";
