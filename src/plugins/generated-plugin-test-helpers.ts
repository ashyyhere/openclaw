// plugins generated plugin test helpers helpers and runtime behavior.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach } from "vitest";

/** Reused constant for plugin Test Repo Root behavior in src/plugins. */
export const pluginTestRepoRoot = path.resolve(import.meta.dirname, "../..");

const tempDirs: string[] = [];

/** Reused helper for write Json behavior in src/plugins. */
export function writeJson(filePath: string, value: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

/** Reused helper for create Generated Plugin Temp Root behavior in src/plugins. */
export function createGeneratedPluginTempRoot(prefix: string): string {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(tempRoot);
  return tempRoot;
}

/** Reused helper for install Generated Plugin Temp Root Cleanup behavior in src/plugins. */
export function installGeneratedPluginTempRootCleanup() {
  afterEach(() => {
    for (const dir of tempDirs.splice(0)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
}
