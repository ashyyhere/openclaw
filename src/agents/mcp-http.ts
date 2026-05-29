/** HTTP MCP launch config normalization and descriptions. */
import {
  redactSensitiveUrl,
  redactSensitiveUrlLikeString,
} from "@openclaw/net-policy/redact-sensitive-url";
import { isMcpConfigRecord, toMcpStringRecord } from "./mcp-config-shared.js";

/** Supported HTTP MCP transport variants. */
export type HttpMcpTransportType = "sse" | "streamable-http";

type HttpMcpServerLaunchConfig = {
  transportType: HttpMcpTransportType;
  url: string;
  headers?: Record<string, string>;
};

type HttpMcpServerLaunchResult =
  | { ok: true; config: HttpMcpServerLaunchConfig }
  | { ok: false; reason: string };

/** Resolve launch config for an HTTP MCP server. */
export function resolveHttpMcpServerLaunchConfig(
  raw: unknown,
  options?: {
    transportType?: HttpMcpTransportType;
    onDroppedHeader?: (key: string, value: unknown) => void;
    onMalformedHeaders?: (value: unknown) => void;
  },
): HttpMcpServerLaunchResult {
  if (!isMcpConfigRecord(raw)) {
    return { ok: false, reason: "server config must be an object" };
  }
  if (typeof raw.url !== "string" || raw.url.trim().length === 0) {
    return { ok: false, reason: "its url is missing" };
  }
  const url = raw.url.trim();
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return {
      ok: false,
      reason: `its url is not a valid URL: ${redactSensitiveUrlLikeString(url)}`,
    };
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return {
      ok: false,
      reason: `only http and https URLs are supported, got ${parsed.protocol}`,
    };
  }

  let headers: Record<string, string> | undefined;
  if (raw.headers !== undefined && raw.headers !== null) {
    if (!isMcpConfigRecord(raw.headers)) {
      options?.onMalformedHeaders?.(raw.headers);
    } else {
      headers = toMcpStringRecord(raw.headers, {
        onDroppedEntry: options?.onDroppedHeader,
      });
    }
  }

  return {
    ok: true,
    config: {
      transportType: options?.transportType ?? "sse",
      url,
      headers,
    },
  };
}

/** Format a compact description of an HTTP MCP launch config. */
export function describeHttpMcpServerLaunchConfig(config: HttpMcpServerLaunchConfig): string {
  return redactSensitiveUrl(config.url);
}
