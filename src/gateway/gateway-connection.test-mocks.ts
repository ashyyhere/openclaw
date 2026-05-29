// gateway gateway connection test mocks helpers and runtime behavior.
import { vi, type Mock } from "vitest";

type TestMock<TArgs extends unknown[] = unknown[], TResult = unknown> = Mock<
  (...args: TArgs) => TResult
>;

/** Reused constant for load Config Mock behavior in src/gateway. */
export const loadConfigMock: TestMock = vi.fn();
/** Reused constant for resolve Gateway Port Mock behavior in src/gateway. */
export const resolveGatewayPortMock: TestMock = vi.fn();
/** Reused constant for resolve State Dir Mock behavior in src/gateway. */
export const resolveStateDirMock: TestMock<[NodeJS.ProcessEnv], string> = vi.fn(
  (env: NodeJS.ProcessEnv) => env.OPENCLAW_STATE_DIR ?? "/tmp/openclaw",
);
/** Reused constant for resolve Config Path Mock behavior in src/gateway. */
export const resolveConfigPathMock: TestMock<[NodeJS.ProcessEnv, string], string> = vi.fn(
  (env: NodeJS.ProcessEnv, stateDir: string) =>
    env.OPENCLAW_CONFIG_PATH ?? `${stateDir}/openclaw.json`,
);
/** Reused constant for pick Primary Tailnet IPv4 Mock behavior in src/gateway. */
export const pickPrimaryTailnetIPv4Mock: TestMock = vi.fn();
/** Reused constant for pick Primary Lan IPv4 Mock behavior in src/gateway. */
export const pickPrimaryLanIPv4Mock: TestMock = vi.fn();
/** Reused constant for is Loopback Host Mock behavior in src/gateway. */
export const isLoopbackHostMock: TestMock<[string], boolean> = vi.fn((host: string) =>
  /^(localhost|127(?:\.\d{1,3}){3}|::1|\[::1\]|::ffff:127(?:\.\d{1,3}){3})$/i.test(
    host.trim().replace(/\.+$/, ""),
  ),
);
/** Reused constant for is Secure Web Socket Url Mock behavior in src/gateway. */
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
