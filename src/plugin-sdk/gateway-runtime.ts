// Public gateway/client helpers for plugins that talk to the host gateway surface.

export * from "../gateway/channel-status-patches.js";
/** CLI option and RPC helpers for plugin commands that call the gateway. */
export { addGatewayClientOptions, callGatewayFromCli } from "../cli/gateway-rpc.js";
/** Gateway RPC connection options accepted by CLI-facing plugin commands. */
export type { GatewayRpcOpts } from "../cli/gateway-rpc.js";
/** Loopback host guard used before exposing local gateway-only URLs. */
export { isLoopbackHost } from "../gateway/net.js";
/** Builds browser URLs for plugin-hosted gateway surfaces. */
export { resolveHostedPluginSurfaceUrl } from "../gateway/hosted-plugin-surface-url.js";
/** Input contract for hosted plugin surface URL construction. */
export type { HostedPluginSurfaceUrlParams } from "../gateway/hosted-plugin-surface-url.js";
/** Capability-token helpers for short-lived plugin node URLs. */
export {
  buildPluginNodeCapabilityScopedHostUrl,
  DEFAULT_PLUGIN_NODE_CAPABILITY_TTL_MS,
  mintPluginNodeCapabilityToken,
  normalizePluginNodeCapabilityScopedUrl,
  PLUGIN_NODE_CAPABILITY_PATH_PREFIX,
} from "../gateway/plugin-node-capability.js";
/** Parsed plugin node capability URL contracts shared with callers. */
export type {
  NormalizedPluginNodeCapabilityUrl,
  PluginNodeCapabilitySurface,
} from "../gateway/plugin-node-capability.js";
/** Node command policy checks for plugin-owned node invocations. */
export {
  isNodeCommandAllowed,
  resolveNodeCommandAllowlist,
} from "../gateway/node-command-policy.js";
/** Registered gateway node session shape exposed to plugin runtimes. */
export type { NodeSession } from "../gateway/node-registry.js";
/** Node-list matching helpers for user-specified node ids or names. */
export { resolveNodeFromNodeList, resolveNodeIdFromNodeList } from "../shared/node-resolve.js";
/** Candidate shape accepted by gateway node matching helpers. */
export type { NodeMatchCandidate } from "../shared/node-match.js";
/** Shared node-method response helpers for unavailable nodes and JSON parsing. */
export {
  respondUnavailableOnNodeInvokeError,
  safeParseJson,
} from "../gateway/server-methods/nodes.helpers.js";
/** Handler map implemented by plugin-facing gateway method servers. */
export type { GatewayRequestHandlers } from "../gateway/server-methods/types.js";
/** Startup-time auth guard for plugin gateway processes. */
export { ensureGatewayStartupAuth } from "../gateway/startup-auth.js";
/** Resolves gateway auth material for clients and hosted plugin surfaces. */
export { resolveGatewayAuth } from "../gateway/auth.js";
/** Converts websocket raw payload data into text frames. */
export { rawDataToString } from "../infra/ws.js";
/** Gateway client used by plugins that need direct host RPC access. */
export { GatewayClient } from "../gateway/client.js";
/** Defers gateway client startup until the plugin event loop is ready. */
export { startGatewayClientWhenEventLoopReady } from "../gateway/client-start-readiness.js";
/** Gateway client helpers that preserve operator approval routing. */
export {
  createOperatorApprovalsGatewayClient,
  withOperatorApprovalsGatewayClient,
} from "../gateway/operator-approvals-client.js";
/** Protocol error helpers shared by gateway clients and handlers. */
export { ErrorCodes, errorShape } from "../../packages/gateway-protocol/src/index.js";
/** Gateway event-frame protocol type emitted over websocket streams. */
export type { EventFrame } from "../../packages/gateway-protocol/src/index.js";
/** Server-method options used when registering gateway request handlers. */
export type { GatewayRequestHandlerOptions } from "../gateway/server-methods/types.js";
