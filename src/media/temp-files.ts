// media temp files helpers and runtime behavior.
import fs from "node:fs/promises";

/** Reused helper for unlink If Exists behavior in src/media. */
export async function unlinkIfExists(filePath: string | null | undefined): Promise<void> {
  if (!filePath) {
    return;
  }
  try {
    await fs.unlink(filePath);
  } catch {
    // Best-effort cleanup for temp files.
  }
}
