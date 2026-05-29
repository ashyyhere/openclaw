// test-utils temp dir helpers and runtime behavior.
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

/** Reused helper for with Temp Dir behavior in src/test-utils. */
export async function withTempDir<T>(prefix: string, run: (dir: string) => Promise<T>): Promise<T> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
  try {
    return await run(dir);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}
