// Small synchronous temp-repo helpers for tests that need filesystem setup before imports run.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

/** Create a temp repo root and register it for later cleanup. */
export function makeTempRepoRoot(tempDirs: string[], prefix: string): string {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(repoRoot);
  return repoRoot;
}

/** Write a formatted JSON fixture, creating parent directories first. */
export function writeJsonFile(filePath: string, value: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

/** Remove all registered temp directories and clear the caller-owned list. */
export function cleanupTempDirs(tempDirs: string[]): void {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 20 });
  }
}
