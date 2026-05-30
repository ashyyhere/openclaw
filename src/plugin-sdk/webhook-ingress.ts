/** Public SDK barrel for webhook ingress route helpers. */
export {
  createBoundedCounter,
  createFixedWindowRateLimiter,
  createWebhookAnomalyTracker,
  WEBHOOK_ANOMALY_COUNTER_DEFAULTS,
  WEBHOOK_ANOMALY_STATUS_CODES,
  WEBHOOK_RATE_LIMIT_DEFAULTS,
  type BoundedCounter,
  type FixedWindowRateLimiter,
  type WebhookAnomalyTracker,
} from "./webhook-memory-guards.js";
/** Webhook memory guard primitives for counters, rate limits, and anomaly tracking. */
export {
  applyBasicWebhookRequestGuards,
  beginWebhookRequestPipelineOrReject,
  createWebhookInFlightLimiter,
  isJsonContentType,
  isRequestBodyLimitError,
  readRequestBodyWithLimit,
  readJsonWebhookBodyOrReject,
  readWebhookBodyOrReject,
  requestBodyErrorToText,
  WEBHOOK_BODY_READ_DEFAULTS,
  WEBHOOK_IN_FLIGHT_DEFAULTS,
  type WebhookBodyReadProfile,
  type WebhookInFlightLimiter,
} from "./webhook-request-guards.js";
/** Request pipeline guards for body limits, JSON parsing, and in-flight rejection. */
export {
  registerPluginHttpRoute,
  registerWebhookTarget,
  registerWebhookTargetWithPluginRoute,
  resolveSingleWebhookTarget,
  resolveSingleWebhookTargetAsync,
  resolveWebhookTargetWithAuthOrReject,
  resolveWebhookTargetWithAuthOrRejectSync,
  resolveWebhookTargets,
  withResolvedWebhookRequestPipeline,
  type RegisterWebhookPluginRouteOptions,
  type RegisterWebhookTargetOptions,
  type RegisteredWebhookTarget,
  type WebhookTargetMatchResult,
} from "./webhook-targets.js";
/** Normalize plugin-provided webhook paths before registration or matching. */
export { normalizeWebhookPath, resolveWebhookPath } from "./webhook-path.js";
/** Resolve the best client IP from gateway request headers. */
export { resolveRequestClientIp } from "../gateway/net.js";
/** Build auth rate limiters shared by webhook and route ingress guards. */
export { createAuthRateLimiter } from "../gateway/auth-rate-limit.js";
/** Auth limiter types exposed so plugin routes can share gateway guard config. */
export type { AuthRateLimiter, RateLimitConfig } from "../gateway/auth-rate-limit.js";
/** Convert raw websocket or HTTP body chunks into bounded strings. */
export { rawDataToString } from "../infra/ws.js";
/** Normalize plugin HTTP route paths using the core route contract. */
export { normalizePluginHttpPath } from "../plugins/http-path.js";
/** Default webhook body cap used by SDK ingress helpers. */
export { DEFAULT_WEBHOOK_MAX_BODY_BYTES } from "../infra/http-body.js";
