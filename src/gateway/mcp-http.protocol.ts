// gateway mcp http protocol helpers and runtime behavior.
/** Reused constant for MCP LOOPBACK SERVER NAME behavior in src/gateway. */
export const MCP_LOOPBACK_SERVER_NAME = "openclaw";
/** Reused constant for MCP LOOPBACK SERVER VERSION behavior in src/gateway. */
export const MCP_LOOPBACK_SERVER_VERSION = "0.1.0";
/** Reused constant for MCP LOOPBACK SUPPORTED PROTOCOL VERSIONS behavior in src/gateway. */
export const MCP_LOOPBACK_SUPPORTED_PROTOCOL_VERSIONS = ["2025-03-26", "2024-11-05"] as const;

type JsonRpcId = string | number | null | undefined;

/** Shared type for Json Rpc Request in src/gateway. */
export type JsonRpcRequest = {
  jsonrpc: "2.0";
  id?: JsonRpcId;
  method: string;
  params?: Record<string, unknown>;
};

/** Reused helper for json Rpc Result behavior in src/gateway. */
export function jsonRpcResult(id: JsonRpcId, result: unknown) {
  return { jsonrpc: "2.0" as const, id: id ?? null, result };
}

/** Reused helper for json Rpc Error behavior in src/gateway. */
export function jsonRpcError(id: JsonRpcId, code: number, message: string) {
  return { jsonrpc: "2.0" as const, id: id ?? null, error: { code, message } };
}
