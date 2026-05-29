/** Normalizes and validates individual workspace directory paths. */
import path from "node:path";
import { resolveUserPath } from "../utils.js";

/** Reused helper for normalize Workspace Dir behavior in src/agents. */
export function normalizeWorkspaceDir(workspaceDir?: string): string | null {
  const trimmed = workspaceDir?.trim();
  if (!trimmed) {
    return null;
  }
  const expanded = trimmed.startsWith("~") ? resolveUserPath(trimmed) : trimmed;
  const resolved = path.resolve(expanded);
  // Refuse filesystem roots as "workspace" (too broad; almost always a bug).
  if (resolved === path.parse(resolved).root) {
    return null;
  }
  return resolved;
}

/** Reused helper for resolve Workspace Root behavior in src/agents. */
export function resolveWorkspaceRoot(workspaceDir?: string): string {
  return normalizeWorkspaceDir(workspaceDir) ?? process.cwd();
}
