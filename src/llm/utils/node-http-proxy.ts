// Node HTTP(S) proxy agent helpers for provider SDK clients.
import type { Agent as HttpAgent } from "node:http";
import type { Agent as HttpsAgent } from "node:https";
import {
  createFixedNodeProxyAgentPair,
  resolveEnvNodeProxyUrlForTarget,
  UNSUPPORTED_PROXY_PROTOCOL_MESSAGE,
} from "../../infra/net/node-proxy-agent.js";

/** Paired HTTP and HTTPS agents configured for one proxy endpoint. */
export interface NodeHttpProxyAgents {
  httpAgent: HttpAgent;
  httpsAgent: HttpsAgent;
}

/** Shared error message for proxy URL schemes unsupported by Node provider clients. */
export { UNSUPPORTED_PROXY_PROTOCOL_MESSAGE };

/** Resolves the proxy URL selected by environment rules for a target provider URL. */
export function resolveHttpProxyUrlForTarget(targetUrl: string | URL): URL | undefined {
  return resolveEnvNodeProxyUrlForTarget(targetUrl);
}

/** Creates fixed HTTP(S) proxy agents when env proxy rules apply to the target. */
export function createHttpProxyAgentsForTarget(
  targetUrl: string | URL,
): NodeHttpProxyAgents | undefined {
  const proxyUrl = resolveHttpProxyUrlForTarget(targetUrl);
  if (!proxyUrl) {
    return undefined;
  }

  return createFixedNodeProxyAgentPair(proxyUrl) as NodeHttpProxyAgents;
}
