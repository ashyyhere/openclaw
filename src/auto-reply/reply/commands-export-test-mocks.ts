// Shared mocks for command export tests.
import type { vi } from "vitest";

type ViLike = Pick<typeof vi, "fn">;

/** Reused helper for create Export Command Session Mocks behavior in src/auto-reply/reply. */
export function createExportCommandSessionMocks(viInstance: ViLike) {
  return {
    resolveDefaultSessionStorePathMock: viInstance.fn(() => "/tmp/target-store/sessions.json"),
    resolveSessionFilePathMock: viInstance.fn(() => "/tmp/target-store/session.jsonl"),
    resolveSessionFilePathOptionsMock: viInstance.fn(
      (params: { agentId: string; storePath: string }) => params,
    ),
    loadSessionStoreMock: viInstance.fn(() => ({
      "agent:target:session": {
        sessionId: "session-1",
        updatedAt: 1,
      },
    })),
  };
}
