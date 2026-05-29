// Test support for mocking agent scope resolution in command tests.
import { vi } from "vitest";

/** Reused constant for resolve Session Agent Id Mock behavior in src/auto-reply/reply. */
export const resolveSessionAgentIdMock = vi.fn(() => "main");
/** Reused constant for resolve Agent Dir Mock behavior in src/auto-reply/reply. */
export const resolveAgentDirMock = vi.fn(
  (_cfg: unknown, agentId: string) => `/tmp/workspace/.openclaw/agents/${agentId}/agent`,
);

vi.doMock("../../agents/agent-scope.js", async () => {
  const actual = await vi.importActual<typeof import("../../agents/agent-scope.js")>(
    "../../agents/agent-scope.js",
  );
  return {
    ...actual,
    resolveSessionAgentId: resolveSessionAgentIdMock,
    resolveAgentDir: resolveAgentDirMock,
  };
});
