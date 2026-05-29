// Best-effort cleanup helpers for media temp files.
import fs from "node:fs/promises";

/** Remove a temp file if present, ignoring cleanup races and missing files. */
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
