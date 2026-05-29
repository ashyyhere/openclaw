/** Shared mock connection/gateway helpers for ACP translator tests. */
import type { AgentSideConnection } from "@agentclientprotocol/sdk";
import { vi } from "vitest";
import type { GatewayClient } from "../gateway/client.js";

type TestAcpConnection = AgentSideConnection & {
  __requestPermissionMock: ReturnType<typeof vi.fn>;
  __sessionUpdateMock: ReturnType<typeof vi.fn>;
};

/** Reused helper for create Acp Connection behavior in src/acp. */
export function createAcpConnection(
  params: {
    requestPermission?: ReturnType<typeof vi.fn>;
  } = {},
): TestAcpConnection {
  const requestPermission =
    params.requestPermission ?? vi.fn(async () => ({ outcome: { outcome: "cancelled" } }));
  const sessionUpdate = vi.fn(async () => {});
  return {
    requestPermission,
    sessionUpdate,
    __requestPermissionMock: requestPermission,
    __sessionUpdateMock: sessionUpdate,
  } as unknown as TestAcpConnection;
}

/** Reused helper for create Acp Gateway behavior in src/acp. */
export function createAcpGateway(
  request: GatewayClient["request"] = vi.fn(async () => ({ ok: true })) as GatewayClient["request"],
): GatewayClient {
  return {
    request,
  } as unknown as GatewayClient;
}
