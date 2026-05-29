// gateway mcp http loopback runtime helpers and runtime behavior.
type McpLoopbackRuntime = {
  port: number;
  ownerToken: string;
  nonOwnerToken: string;
};

let activeRuntime: McpLoopbackRuntime | undefined;

/** Reused helper for get Active Mcp Loopback Runtime behavior in src/gateway. */
export function getActiveMcpLoopbackRuntime(): McpLoopbackRuntime | undefined {
  return activeRuntime ? { ...activeRuntime } : undefined;
}

/** Reused helper for set Active Mcp Loopback Runtime behavior in src/gateway. */
export function setActiveMcpLoopbackRuntime(runtime: McpLoopbackRuntime): void {
  activeRuntime = { ...runtime };
}

/** Reused helper for resolve Mcp Loopback Bearer Token behavior in src/gateway. */
export function resolveMcpLoopbackBearerToken(
  runtime: McpLoopbackRuntime,
  senderIsOwner: boolean,
): string {
  return senderIsOwner ? runtime.ownerToken : runtime.nonOwnerToken;
}

/** Reused helper for clear Active Mcp Loopback Runtime By Owner Token behavior in src/gateway. */
export function clearActiveMcpLoopbackRuntimeByOwnerToken(ownerToken: string): void {
  if (activeRuntime?.ownerToken === ownerToken) {
    activeRuntime = undefined;
  }
}

/** Reused helper for create Mcp Loopback Server Config behavior in src/gateway. */
export function createMcpLoopbackServerConfig(port: number) {
  return {
    mcpServers: {
      openclaw: {
        type: "http",
        url: `http://127.0.0.1:${port}/mcp`,
        headers: {
          Authorization: "Bearer ${OPENCLAW_MCP_TOKEN}",
          "x-session-key": "${OPENCLAW_MCP_SESSION_KEY}",
          "x-openclaw-agent-id": "${OPENCLAW_MCP_AGENT_ID}",
          "x-openclaw-account-id": "${OPENCLAW_MCP_ACCOUNT_ID}",
          "x-openclaw-message-channel": "${OPENCLAW_MCP_MESSAGE_CHANNEL}",
          "x-openclaw-current-channel-id": "${OPENCLAW_MCP_CURRENT_CHANNEL_ID}",
          "x-openclaw-current-thread-ts": "${OPENCLAW_MCP_CURRENT_THREAD_TS}",
          "x-openclaw-current-message-id": "${OPENCLAW_MCP_CURRENT_MESSAGE_ID}",
          "x-openclaw-inbound-event-kind": "${OPENCLAW_MCP_INBOUND_EVENT_KIND}",
          "x-openclaw-source-reply-delivery-mode": "${OPENCLAW_MCP_SOURCE_REPLY_DELIVERY_MODE}",
        },
      },
    },
  };
}
