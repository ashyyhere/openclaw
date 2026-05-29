// llm/utils node http proxy helpers and runtime behavior.
import type { Agent as HttpAgent } from "node:http";
import type { Agent as HttpsAgent } from "node:https";
import {
  createFixedNodeProxyAgentPair,
  resolveEnvNodeProxyUrlForTarget,
  UNSUPPORTED_PROXY_PROTOCOL_MESSAGE,
} from "../../infra/net/node-proxy-agent.js";

/** Shared type for Node Http Proxy Agents in src/llm/utils. */
export interface NodeHttpProxyAgents {
  httpAgent: HttpAgent;
  httpsAgent: HttpsAgent;
}

/** Re-exported API for src/llm/utils, starting with UNSUPPORTED PROXY PROTOCOL MESSAGE. */
export { UNSUPPORTED_PROXY_PROTOCOL_MESSAGE };

/** Reused helper for resolve Http Proxy Url For Target behavior in src/llm/utils. */
export function resolveHttpProxyUrlForTarget(targetUrl: string | URL): URL | undefined {
  return resolveEnvNodeProxyUrlForTarget(targetUrl);
}

/** Reused helper for create Http Proxy Agents For Target behavior in src/llm/utils. */
export function createHttpProxyAgentsForTarget(
  targetUrl: string | URL,
): NodeHttpProxyAgents | undefined {
  const proxyUrl = resolveHttpProxyUrlForTarget(targetUrl);
  if (!proxyUrl) {
    return undefined;
  }

  return createFixedNodeProxyAgentPair(proxyUrl) as NodeHttpProxyAgents;
}
