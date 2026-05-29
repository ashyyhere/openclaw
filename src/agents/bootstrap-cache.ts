/** Session-scoped cache for workspace bootstrap files. */
import { loadWorkspaceBootstrapFiles, type WorkspaceBootstrapFile } from "./workspace.js";

type BootstrapSnapshot = {
  workspaceDir: string;
  files: WorkspaceBootstrapFile[];
};

const cache = new Map<string, BootstrapSnapshot>();

function bootstrapFilesEqual(
  previous: WorkspaceBootstrapFile[],
  next: WorkspaceBootstrapFile[],
): boolean {
  if (previous.length !== next.length) {
    return false;
  }

  return previous.every((file, index) => {
    const updated = next[index];
    return (
      updated !== undefined &&
      file.name === updated.name &&
      file.path === updated.path &&
      file.content === updated.content &&
      file.missing === updated.missing
    );
  });
}

/** Load bootstrap files for a session, reusing unchanged snapshots. */
export async function getOrLoadBootstrapFiles(params: {
  workspaceDir: string;
  sessionKey: string;
}): Promise<WorkspaceBootstrapFile[]> {
  const existing = cache.get(params.sessionKey);
  // Refresh per turn so long-lived sessions pick up edits; loadWorkspaceBootstrapFiles
  // handles unchanged file content through its guarded inode/mtime cache.
  const files = await loadWorkspaceBootstrapFiles(params.workspaceDir);
  if (
    existing &&
    existing.workspaceDir === params.workspaceDir &&
    bootstrapFilesEqual(existing.files, files)
  ) {
    return existing.files;
  }

  cache.set(params.sessionKey, { workspaceDir: params.workspaceDir, files });
  return files;
}

/** Clear one session bootstrap snapshot. */
export function clearBootstrapSnapshot(sessionKey: string): void {
  cache.delete(sessionKey);
}

/** Clear cached bootstrap files when a session id rolls over. */
export function clearBootstrapSnapshotOnSessionRollover(params: {
  sessionKey?: string;
  previousSessionId?: string;
}): void {
  if (!params.sessionKey || !params.previousSessionId) {
    return;
  }

  clearBootstrapSnapshot(params.sessionKey);
}

/** Clear all cached bootstrap file snapshots. */
export function clearAllBootstrapSnapshots(): void {
  cache.clear();
}
