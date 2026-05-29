/** Shared runtime mocks for cleanup command tests. */
import { vi } from "vitest";
import { createNonExitingRuntime, type RuntimeEnv } from "../runtime.js";
import type { MockFn } from "../test-utils/vitest-mock-fn.js";

const resolveCleanupPlanFromDisk = vi.fn();
const removePath = vi.fn();
const listAgentSessionDirs = vi.fn();
const removeStateAndLinkedPaths = vi.fn();
const removeWorkspaceDirs = vi.fn();

vi.mock("../config/config.js", () => ({
  isNixMode: false,
}));

vi.mock("./cleanup-plan.js", () => ({
  resolveCleanupPlanFromDisk,
}));

vi.mock("./cleanup-utils.js", () => ({
  removePath,
  listAgentSessionDirs,
  removeStateAndLinkedPaths,
  removeWorkspaceDirs,
}));

/** Reused helper for create Cleanup Command Runtime behavior in src/commands. */
export function createCleanupCommandRuntime() {
  return createNonExitingRuntime();
}

/** Reused helper for reset Cleanup Command Mocks behavior in src/commands. */
export function resetCleanupCommandMocks() {
  vi.clearAllMocks();
  resolveCleanupPlanFromDisk.mockReturnValue({
    stateDir: "/tmp/.openclaw",
    configPath: "/tmp/.openclaw/openclaw.json",
    oauthDir: "/tmp/.openclaw/credentials",
    configInsideState: true,
    oauthInsideState: true,
    workspaceDirs: ["/tmp/.openclaw/workspace"],
  });
  removePath.mockResolvedValue({ ok: true });
  listAgentSessionDirs.mockResolvedValue(["/tmp/.openclaw/agents/main/sessions"]);
  removeStateAndLinkedPaths.mockResolvedValue(undefined);
  removeWorkspaceDirs.mockResolvedValue(undefined);
}

/** Reused helper for silence Cleanup Command Runtime behavior in src/commands. */
export function silenceCleanupCommandRuntime(runtime: RuntimeEnv) {
  vi.spyOn(runtime, "log").mockImplementation(() => {});
  vi.spyOn(runtime, "error").mockImplementation(() => {});
}

/** Reused helper for cleanup Command Log Messages behavior in src/commands. */
export function cleanupCommandLogMessages(runtime: RuntimeEnv): string[] {
  const calls = (runtime.log as MockFn<(...args: unknown[]) => void>).mock.calls;
  return calls.map((call) => String(call[0]));
}
