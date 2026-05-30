import { isRecord } from "../utils.js";

type ConfigMcpServers = Record<string, Record<string, unknown>>;
type OpenClawMcpHttpTransport = "sse" | "streamable-http";

const CLI_MCP_TYPE_TO_OPENCLAW_TRANSPORT: Record<string, OpenClawMcpHttpTransport | "stdio"> = {
  http: "streamable-http",
  "streamable-http": "streamable-http",
  sse: "sse",
  stdio: "stdio",
};

function normalizeMcpString(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

/** Resolves CLI-style MCP transport aliases to OpenClaw HTTP transports. */
export function resolveOpenClawMcpTransportAlias(
  value: unknown,
): OpenClawMcpHttpTransport | undefined {
  const mapped = CLI_MCP_TYPE_TO_OPENCLAW_TRANSPORT[normalizeMcpString(value)];
  return mapped === "sse" || mapped === "streamable-http" ? mapped : undefined;
}

/** Checks whether a config `type` value is a known CLI MCP alias. */
export function isKnownCliMcpTypeAlias(value: unknown): boolean {
  return Object.hasOwn(CLI_MCP_TYPE_TO_OPENCLAW_TRANSPORT, normalizeMcpString(value));
}

/** Converts one configured MCP server to canonical OpenClaw fields. */
export function canonicalizeConfiguredMcpServer(
  server: Record<string, unknown>,
): Record<string, unknown> {
  const next = { ...server };
  const transportAlias = resolveOpenClawMcpTransportAlias(next.type);
  if (typeof next.transport !== "string" && transportAlias) {
    next.transport = transportAlias;
  }
  if (isKnownCliMcpTypeAlias(next.type)) {
    delete next.type;
  }
  return next;
}

/** Normalizes the configured MCP server map, dropping invalid entries. */
export function normalizeConfiguredMcpServers(value: unknown): ConfigMcpServers {
  if (!isRecord(value)) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, server]) => isRecord(server))
      .map(([name, server]) => [name, { ...(server as Record<string, unknown>) }]),
  );
}
