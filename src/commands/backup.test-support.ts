/** Shared backup command test fixtures and runtime mocks. */
import fs from "node:fs/promises";
import path from "node:path";
import { vi } from "vitest";
import type { RuntimeEnv } from "../runtime.js";
import * as backupShared from "./backup-shared.js";
import { resolveBackupPlanFromPaths } from "./backup-shared.js";

const backupTestMocks = vi.hoisted(() => ({
  backupVerifyCommandMock: vi.fn(),
  tarCreateMock: vi.fn(),
}));

/** Reused constant for this surface behavior in src/commands. */
export const { backupVerifyCommandMock, tarCreateMock } = backupTestMocks;

vi.mock("tar", () => ({
  c: backupTestMocks.tarCreateMock,
}));

vi.mock("./backup-verify.js", () => ({
  backupVerifyCommand: backupTestMocks.backupVerifyCommandMock,
}));

/** Reused helper for create Backup Test Runtime behavior in src/commands. */
export function createBackupTestRuntime(): RuntimeEnv {
  return {
    log: vi.fn(),
    error: vi.fn(),
    exit: vi.fn(),
  } satisfies RuntimeEnv;
}

/** Reused helper for reset Backup Temp Home behavior in src/commands. */
export async function resetBackupTempHome(tempHome: { home: string }) {
  await fs.rm(tempHome.home, { recursive: true, force: true });
  await fs.mkdir(path.join(tempHome.home, ".openclaw"), { recursive: true });
  delete process.env.OPENCLAW_CONFIG_PATH;
}

/** Reused helper for mock State Only Backup Plan behavior in src/commands. */
export async function mockStateOnlyBackupPlan(stateDir: string) {
  await fs.writeFile(path.join(stateDir, "openclaw.json"), JSON.stringify({}), "utf8");
  vi.spyOn(backupShared, "resolveBackupPlanFromDisk").mockResolvedValue(
    await resolveBackupPlanFromPaths({
      stateDir,
      configPath: path.join(stateDir, "openclaw.json"),
      oauthDir: path.join(stateDir, "credentials"),
      includeWorkspace: false,
      configInsideState: true,
      oauthInsideState: true,
      nowMs: 123,
    }),
  );
}
