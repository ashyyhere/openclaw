// gateway server http test harness helpers and runtime behavior.
import type { IncomingMessage, ServerResponse } from "node:http";
import { expect, vi } from "vitest";
import type { createSubsystemLogger } from "../logging/subsystem.js";
import type { ResolvedGatewayAuth } from "./auth.js";
import { createGatewayRequest, createHooksConfig } from "./hooks-test-helpers.js";
import { canonicalizePathVariant } from "./security-path.js";
import { createGatewayHttpServer } from "./server-http.js";
import { createHooksRequestHandler } from "./server/hooks-request-handler.js";
import { withTempConfig } from "./test-temp-config.js";

type GatewayHttpServer = ReturnType<typeof createGatewayHttpServer>;
type GatewayServerOptions = Partial<Parameters<typeof createGatewayHttpServer>[0]>;
type HooksHandlerDeps = Parameters<typeof createHooksRequestHandler>[0];

const responseEndPromises = new WeakMap<ServerResponse, Promise<void>>();
/** Reused constant for AUTH NONE behavior in src/gateway. */
export const AUTH_NONE: ResolvedGatewayAuth = {
  mode: "none",
  token: undefined,
  password: undefined,
  allowTailscale: false,
};

/** Reused constant for AUTH TOKEN behavior in src/gateway. */
export const AUTH_TOKEN: ResolvedGatewayAuth = {
  mode: "token",
  token: "test-token",
  password: undefined,
  allowTailscale: false,
};

/** Reused helper for create Request behavior in src/gateway. */
export function createRequest(params: {
  path: string;
  authorization?: string;
  method?: string;
  remoteAddress?: string;
  host?: string;
  headers?: Record<string, string>;
}): IncomingMessage {
  return createGatewayRequest({
    path: params.path,
    authorization: params.authorization,
    method: params.method,
    remoteAddress: params.remoteAddress,
    host: params.host,
    headers: params.headers,
  });
}

/** Reused helper for create Hook Request behavior in src/gateway. */
export function createHookRequest(params?: {
  authorization?: string;
  remoteAddress?: string;
  url?: string;
  headers?: Record<string, string>;
}): IncomingMessage {
  return createRequest({
    method: "POST",
    path: params?.url ?? "/hooks/wake",
    host: "127.0.0.1:18789",
    authorization: params?.authorization ?? "Bearer hook-secret",
    remoteAddress: params?.remoteAddress,
    headers: params?.headers,
  });
}

/** Reused helper for create Response behavior in src/gateway. */
export function createResponse(): {
  res: ServerResponse;
  setHeader: ReturnType<typeof vi.fn>;
  end: ReturnType<typeof vi.fn>;
  getBody: () => string;
} {
  const setHeader = vi.fn();
  let body = "";
  let resolveEnd!: () => void;
  const ended = new Promise<void>((resolve) => {
    resolveEnd = resolve;
  });
  const end = vi.fn((chunk?: unknown) => {
    if (typeof chunk === "string") {
      body = chunk;
      resolveEnd();
      return;
    }
    if (chunk == null) {
      body = "";
      resolveEnd();
      return;
    }
    body = JSON.stringify(chunk);
    resolveEnd();
  });
  const res = {
    headersSent: false,
    statusCode: 200,
    setHeader,
    end,
  } as unknown as ServerResponse;
  responseEndPromises.set(res, ended);
  return {
    res,
    setHeader,
    end,
    getBody: () => body,
  };
}

/** Reused helper for dispatch Request behavior in src/gateway. */
export async function dispatchRequest(
  server: GatewayHttpServer,
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  let timeout: NodeJS.Timeout | undefined;
  server.emit("request", req, res);
  try {
    await Promise.race([
      responseEndPromises.get(res) ?? new Promise((resolve) => setImmediate(resolve)),
      new Promise((_, reject) => {
        timeout = setTimeout(() => {
          reject(new Error(`gateway test request timed out: ${req.method ?? "GET"} ${req.url}`));
        }, 15_000);
      }),
    ]);
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}

/** Reused helper for with Gateway Temp Config behavior in src/gateway. */
export async function withGatewayTempConfig(
  prefix: string,
  run: () => Promise<void>,
): Promise<void> {
  await withTempConfig({
    cfg: { gateway: { trustedProxies: [] } },
    prefix,
    run,
  });
}

/** Reused helper for create Test Gateway Server behavior in src/gateway. */
export function createTestGatewayServer(options: {
  resolvedAuth: ResolvedGatewayAuth;
  overrides?: GatewayServerOptions;
}): GatewayHttpServer {
  return createGatewayHttpServer({
    clients: new Set(),
    controlUiEnabled: false,
    controlUiBasePath: "/__control__",
    openAiChatCompletionsEnabled: false,
    openResponsesEnabled: false,
    handleHooksRequest: async () => false,
    ...options.overrides,
    resolvedAuth: options.resolvedAuth,
  });
}

/** Reused helper for with Gateway Server behavior in src/gateway. */
export async function withGatewayServer(params: {
  prefix: string;
  resolvedAuth: ResolvedGatewayAuth;
  overrides?: GatewayServerOptions;
  run: (server: GatewayHttpServer) => Promise<void>;
}): Promise<void> {
  await withGatewayTempConfig(params.prefix, async () => {
    const server = createTestGatewayServer({
      resolvedAuth: params.resolvedAuth,
      overrides: params.overrides,
    });
    await params.run(server);
  });
}

/** Reused helper for send Request behavior in src/gateway. */
export async function sendRequest(
  server: GatewayHttpServer,
  params: {
    path: string;
    authorization?: string;
    method?: string;
    remoteAddress?: string;
    host?: string;
  },
): Promise<ReturnType<typeof createResponse>> {
  const response = createResponse();
  await dispatchRequest(server, createRequest(params), response.res);
  return response;
}

/** Reused helper for expect Unauthorized Response behavior in src/gateway. */
export function expectUnauthorizedResponse(
  response: ReturnType<typeof createResponse>,
  label?: string,
): void {
  expect(response.res.statusCode, label).toBe(401);
  expect(response.getBody(), label).toContain("Unauthorized");
}

/** Reused helper for create Canonicalized Channel Plugin Handler behavior in src/gateway. */
export function createCanonicalizedChannelPluginHandler() {
  return vi.fn(async (req: IncomingMessage, res: ServerResponse) => {
    const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
    const canonicalPath = canonicalizePathVariant(pathname);
    if (canonicalPath !== "/api/channels/nostr/default/profile") {
      return false;
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ ok: true, route: "channel-canonicalized" }));
    return true;
  });
}

/** Reused helper for create Hooks Handler behavior in src/gateway. */
export function createHooksHandler(
  params:
    | string
    | {
        dispatchWakeHook?: HooksHandlerDeps["dispatchWakeHook"];
        dispatchAgentHook?: HooksHandlerDeps["dispatchAgentHook"];
        bindHost?: string;
        getClientIpConfig?: HooksHandlerDeps["getClientIpConfig"];
      },
) {
  const options = typeof params === "string" ? { bindHost: params } : params;
  return createHooksRequestHandler({
    getHooksConfig: () => createHooksConfig(),
    bindHost: options.bindHost ?? "127.0.0.1",
    port: 18789,
    logHooks: {
      warn: vi.fn(),
      debug: vi.fn(),
      info: vi.fn(),
      error: vi.fn(),
    } as unknown as ReturnType<typeof createSubsystemLogger>,
    getClientIpConfig: options.getClientIpConfig,
    dispatchWakeHook: options.dispatchWakeHook ?? (() => {}),
    dispatchAgentHook: options.dispatchAgentHook ?? (() => "run-1"),
  });
}

type RouteVariant = {
  label: string;
  path: string;
};

/** Reused constant for CANONICAL UNAUTH VARIANTS behavior in src/gateway. */
export const CANONICAL_UNAUTH_VARIANTS: RouteVariant[] = [
  { label: "case-variant", path: "/API/channels/nostr/default/profile" },
  { label: "encoded-slash", path: "/api/channels%2Fnostr%2Fdefault%2Fprofile" },
  {
    label: "encoded-slash-4x",
    path: "/api%2525252fchannels%2525252fnostr%2525252fdefault%2525252fprofile",
  },
  { label: "encoded-segment", path: "/api/%63hannels/nostr/default/profile" },
  { label: "dot-traversal-encoded-slash", path: "/api/foo/..%2fchannels/nostr/default/profile" },
  {
    label: "dot-traversal-encoded-dotdot-slash",
    path: "/api/foo/%2e%2e%2fchannels/nostr/default/profile",
  },
  {
    label: "dot-traversal-double-encoded",
    path: "/api/foo/%252e%252e%252fchannels/nostr/default/profile",
  },
  { label: "duplicate-slashes", path: "/api/channels//nostr/default/profile" },
  { label: "trailing-slash", path: "/api/channels/nostr/default/profile/" },
  { label: "malformed-short-percent", path: "/api/channels%2" },
  { label: "malformed-double-slash-short-percent", path: "/api//channels%2" },
];

/** Reused constant for CANONICAL AUTH VARIANTS behavior in src/gateway. */
export const CANONICAL_AUTH_VARIANTS: RouteVariant[] = [
  { label: "auth-case-variant", path: "/API/channels/nostr/default/profile" },
  {
    label: "auth-encoded-slash-4x",
    path: "/api%2525252fchannels%2525252fnostr%2525252fdefault%2525252fprofile",
  },
  { label: "auth-encoded-segment", path: "/api/%63hannels/nostr/default/profile" },
  { label: "auth-duplicate-trailing-slash", path: "/api/channels//nostr/default/profile/" },
  {
    label: "auth-dot-traversal-encoded-slash",
    path: "/api/foo/..%2fchannels/nostr/default/profile",
  },
  {
    label: "auth-dot-traversal-double-encoded",
    path: "/api/foo/%252e%252e%252fchannels/nostr/default/profile",
  },
];

/** Reused helper for build Channel Path Fuzz Corpus behavior in src/gateway. */
export function buildChannelPathFuzzCorpus(): RouteVariant[] {
  const variants = [
    "/api/channels/nostr/default/profile",
    "/API/channels/nostr/default/profile",
    "/api/foo/..%2fchannels/nostr/default/profile",
    "/api/foo/%2e%2e%2fchannels/nostr/default/profile",
    "/api/foo/%252e%252e%252fchannels/nostr/default/profile",
    "/api/channels//nostr/default/profile/",
    "/api/channels%2Fnostr%2Fdefault%2Fprofile",
    "/api/channels%252Fnostr%252Fdefault%252Fprofile",
    "/api%2525252fchannels%2525252fnostr%2525252fdefault%2525252fprofile",
    "/api//channels/nostr/default/profile",
    "/api/channels%2",
    "/api/channels%zz",
    "/api//channels%2",
    "/api//channels%zz",
  ];
  return variants.map((path) => ({ label: `fuzz:${path}`, path }));
}

/** Reused helper for expect Unauthorized Variants behavior in src/gateway. */
export async function expectUnauthorizedVariants(params: {
  server: GatewayHttpServer;
  variants: RouteVariant[];
}) {
  for (const variant of params.variants) {
    const response = await sendRequest(params.server, { path: variant.path });
    expectUnauthorizedResponse(response, variant.label);
  }
}

/** Reused helper for expect Authorized Variants behavior in src/gateway. */
export async function expectAuthorizedVariants(params: {
  server: GatewayHttpServer;
  variants: RouteVariant[];
  authorization: string;
}) {
  for (const variant of params.variants) {
    const response = await sendRequest(params.server, {
      path: variant.path,
      authorization: params.authorization,
    });
    expect(response.res.statusCode, variant.label).toBe(200);
    expect(response.getBody(), variant.label).toContain('"route":"channel-canonicalized"');
  }
}
