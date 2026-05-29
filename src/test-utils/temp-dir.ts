// Temporary directory wrapper with automatic recursive cleanup.
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

/** Runs a callback inside a new temp directory and removes it afterwards. */
export async function withTempDir<T>(prefix: string, run: (dir: string) => Promise<T>): Promise<T> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
  try {
    return await run(dir);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}
