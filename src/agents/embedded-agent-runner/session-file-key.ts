/** Resolves stable registry keys for embedded-agent session files. */
import fs from "node:fs";
import path from "node:path";

/** Returns a canonical key that survives symlinked or unresolved session paths. */
export function resolveEmbeddedSessionFileKey(sessionFile: string): string {
  const resolvedSessionFile = path.resolve(sessionFile);
  const realpathSync = fs.realpathSync.native ?? fs.realpathSync;
  try {
    return realpathSync(resolvedSessionFile);
  } catch {
    // New transcript files often do not exist yet. Canonicalize the existing
    // parent so aliases still collapse before the first write creates the file.
  }
  const sessionDir = path.dirname(resolvedSessionFile);
  try {
    return path.join(realpathSync(sessionDir), path.basename(resolvedSessionFile));
  } catch {
    return resolvedSessionFile;
  }
}
