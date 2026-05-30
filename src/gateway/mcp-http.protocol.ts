// JSON-RPC helpers and protocol metadata for the gateway MCP loopback server.
/** MCP server name announced by the gateway loopback endpoint. */
export const MCP_LOOPBACK_SERVER_NAME = "openclaw";
/** MCP loopback server protocol-facing version. */
export const MCP_LOOPBACK_SERVER_VERSION = "0.1.0";
/** Protocol versions accepted by the gateway MCP loopback endpoint. */
export const MCP_LOOPBACK_SUPPORTED_PROTOCOL_VERSIONS = ["2025-03-26", "2024-11-05"] as const;

type JsonRpcId = string | number | null | undefined;

/** Minimal JSON-RPC request shape accepted by the MCP loopback endpoint. */
export type JsonRpcRequest = {
  jsonrpc: "2.0";
  id?: JsonRpcId;
  method: string;
  params?: Record<string, unknown>;
};

/** Build a JSON-RPC success envelope with a normalized null id. */
export function jsonRpcResult(id: JsonRpcId, result: unknown) {
  return { jsonrpc: "2.0" as const, id: id ?? null, result };
}

/** Build a JSON-RPC error envelope with a normalized null id. */
export function jsonRpcError(id: JsonRpcId, code: number, message: string) {
  return { jsonrpc: "2.0" as const, id: id ?? null, error: { code, message } };
}
