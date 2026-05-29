// Public gateway/client helpers for plugins that talk to the host gateway surface.

export * from "../gateway/channel-status-patches.js";
/** Re-exported API for src/plugin-sdk, starting with add Gateway Client Options. */
export { addGatewayClientOptions, callGatewayFromCli } from "../cli/gateway-rpc.js";
/** Re-exported API for src/plugin-sdk, starting with Gateway Rpc Opts. */
export type { GatewayRpcOpts } from "../cli/gateway-rpc.js";
/** Re-exported API for src/plugin-sdk, starting with is Loopback Host. */
export { isLoopbackHost } from "../gateway/net.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Hosted Plugin Surface Url. */
export { resolveHostedPluginSurfaceUrl } from "../gateway/hosted-plugin-surface-url.js";
/** Re-exported API for src/plugin-sdk, starting with Hosted Plugin Surface Url Params. */
export type { HostedPluginSurfaceUrlParams } from "../gateway/hosted-plugin-surface-url.js";
/** Re-exported API for src/plugin-sdk. */
export {
  buildPluginNodeCapabilityScopedHostUrl,
  DEFAULT_PLUGIN_NODE_CAPABILITY_TTL_MS,
  mintPluginNodeCapabilityToken,
  normalizePluginNodeCapabilityScopedUrl,
  PLUGIN_NODE_CAPABILITY_PATH_PREFIX,
} from "../gateway/plugin-node-capability.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  NormalizedPluginNodeCapabilityUrl,
  PluginNodeCapabilitySurface,
} from "../gateway/plugin-node-capability.js";
/** Re-exported API for src/plugin-sdk. */
export {
  isNodeCommandAllowed,
  resolveNodeCommandAllowlist,
} from "../gateway/node-command-policy.js";
/** Re-exported API for src/plugin-sdk, starting with Node Session. */
export type { NodeSession } from "../gateway/node-registry.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Node From Node List. */
export { resolveNodeFromNodeList, resolveNodeIdFromNodeList } from "../shared/node-resolve.js";
/** Re-exported API for src/plugin-sdk, starting with Node Match Candidate. */
export type { NodeMatchCandidate } from "../shared/node-match.js";
/** Re-exported API for src/plugin-sdk. */
export {
  respondUnavailableOnNodeInvokeError,
  safeParseJson,
} from "../gateway/server-methods/nodes.helpers.js";
/** Re-exported API for src/plugin-sdk, starting with Gateway Request Handlers. */
export type { GatewayRequestHandlers } from "../gateway/server-methods/types.js";
/** Re-exported API for src/plugin-sdk, starting with ensure Gateway Startup Auth. */
export { ensureGatewayStartupAuth } from "../gateway/startup-auth.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Gateway Auth. */
export { resolveGatewayAuth } from "../gateway/auth.js";
/** Re-exported API for src/plugin-sdk, starting with raw Data To String. */
export { rawDataToString } from "../infra/ws.js";
/** Re-exported API for src/plugin-sdk, starting with Gateway Client. */
export { GatewayClient } from "../gateway/client.js";
/** Re-exported API for src/plugin-sdk, starting with start Gateway Client When Event Loop Ready. */
export { startGatewayClientWhenEventLoopReady } from "../gateway/client-start-readiness.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createOperatorApprovalsGatewayClient,
  withOperatorApprovalsGatewayClient,
} from "../gateway/operator-approvals-client.js";
/** Re-exported API for src/plugin-sdk, starting with Error Codes. */
export { ErrorCodes, errorShape } from "../../packages/gateway-protocol/src/index.js";
/** Re-exported API for src/plugin-sdk, starting with Event Frame. */
export type { EventFrame } from "../../packages/gateway-protocol/src/index.js";
/** Re-exported API for src/plugin-sdk, starting with Gateway Request Handler Options. */
export type { GatewayRequestHandlerOptions } from "../gateway/server-methods/types.js";
