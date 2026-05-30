// Shared Vitest mocks for gateway connection tests.
import { vi, type Mock } from "vitest";

type TestMock<TArgs extends unknown[] = unknown[], TResult = unknown> = Mock<
  (...args: TArgs) => TResult
>;

/** Mocked config loader used by gateway connection tests. */
export const loadConfigMock: TestMock = vi.fn();
/** Mocked gateway port resolver used by connection bootstrap tests. */
export const resolveGatewayPortMock: TestMock = vi.fn();
/** Mocked state-dir resolver with a stable test fallback. */
export const resolveStateDirMock: TestMock<[NodeJS.ProcessEnv], string> = vi.fn(
  (env: NodeJS.ProcessEnv) => env.OPENCLAW_STATE_DIR ?? "/tmp/openclaw",
);
/** Mocked config-path resolver derived from test env and state dir. */
export const resolveConfigPathMock: TestMock<[NodeJS.ProcessEnv, string], string> = vi.fn(
  (env: NodeJS.ProcessEnv, stateDir: string) =>
    env.OPENCLAW_CONFIG_PATH ?? `${stateDir}/openclaw.json`,
);
/** Mocked Tailnet IPv4 picker for advertised gateway addresses. */
export const pickPrimaryTailnetIPv4Mock: TestMock = vi.fn();
/** Mocked LAN IPv4 picker for advertised gateway addresses. */
export const pickPrimaryLanIPv4Mock: TestMock = vi.fn();
/** Mocked loopback-host guard that matches gateway URL validation behavior. */
export const isLoopbackHostMock: TestMock<[string], boolean> = vi.fn((host: string) =>
  /^(localhost|127(?:\.\d{1,3}){3}|::1|\[::1\]|::ffff:127(?:\.\d{1,3}){3})$/i.test(
    host.trim().replace(/\.+$/, ""),
  ),
);
/** Mocked secure-WebSocket guard with optional private ws allowance. */
export const isSecureWebSocketUrlMock: TestMock<
  [string, { allowPrivateWs?: boolean } | undefined],
  boolean
> = vi.fn((url: string, opts?: { allowPrivateWs?: boolean }) => {
  const parsed = new URL(url);
  if (parsed.protocol === "wss:") {
    return true;
  }
  if (parsed.protocol !== "ws:") {
    return false;
  }
  return opts?.allowPrivateWs === true || isLoopbackHostMock(parsed.hostname);
});

vi.mock("../infra/tailnet.js", () => ({
  pickPrimaryTailnetIPv4: pickPrimaryTailnetIPv4Mock,
}));
