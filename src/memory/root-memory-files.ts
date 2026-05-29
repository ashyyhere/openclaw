// Root MEMORY.md path policy and legacy filename repair helpers.
import fs from "node:fs/promises";
import path from "node:path";

/** Canonical workspace-level memory file name used by current config and docs. */
export const CANONICAL_ROOT_MEMORY_FILENAME = "MEMORY.md";
/** Former lowercase root memory file name detected for repair and skip logic. */
export const LEGACY_ROOT_MEMORY_FILENAME = "memory.md";
const ROOT_MEMORY_REPAIR_RELATIVE_DIR = ".openclaw-repair/root-memory";

/** Returns the canonical root memory path for a workspace. */
export function resolveCanonicalRootMemoryPath(workspaceDir: string): string {
  return path.join(workspaceDir, CANONICAL_ROOT_MEMORY_FILENAME);
}

/** Returns the legacy lowercase root memory path for migration checks. */
export function resolveLegacyRootMemoryPath(workspaceDir: string): string {
  return path.join(workspaceDir, LEGACY_ROOT_MEMORY_FILENAME);
}

/** Returns the repair directory used to park conflicting legacy root memory files. */
export function resolveRootMemoryRepairDir(workspaceDir: string): string {
  return path.join(workspaceDir, ".openclaw-repair", "root-memory");
}

function normalizeWorkspaceRelativePath(value: string): string {
  return value.trim().replace(/\\/g, "/").replace(/^\.\//, "");
}

/** Checks for an exact directory entry without case-insensitive path resolution. */
export async function exactWorkspaceEntryExists(dir: string, name: string): Promise<boolean> {
  try {
    const entries = await fs.readdir(dir);
    return entries.includes(name);
  } catch {
    return false;
  }
}

/** Resolves the canonical root memory file only when the exact file exists. */
export async function resolveCanonicalRootMemoryFile(workspaceDir: string): Promise<string | null> {
  try {
    const entries = await fs.readdir(workspaceDir, { withFileTypes: true });
    for (const entry of entries) {
      if (
        entry.name === CANONICAL_ROOT_MEMORY_FILENAME &&
        entry.isFile() &&
        !entry.isSymbolicLink()
      ) {
        return path.join(workspaceDir, entry.name);
      }
    }
  } catch {}
  return null;
}

/** Skips legacy and repair files when scanning workspace memory sources. */
export function shouldSkipRootMemoryAuxiliaryPath(params: {
  workspaceDir: string;
  absPath: string;
}): boolean {
  const relative = path.relative(params.workspaceDir, params.absPath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return false;
  }
  const normalized = normalizeWorkspaceRelativePath(relative);
  return (
    normalized === LEGACY_ROOT_MEMORY_FILENAME ||
    normalized === ROOT_MEMORY_REPAIR_RELATIVE_DIR ||
    normalized.startsWith(`${ROOT_MEMORY_REPAIR_RELATIVE_DIR}/`)
  );
}
