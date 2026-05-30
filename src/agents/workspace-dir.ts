import path from "node:path";
import { resolveUserPath } from "../utils.js";

/** Normalize a user-provided workspace path, rejecting filesystem roots. */
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

/** Resolve the active workspace root, falling back to the process cwd. */
export function resolveWorkspaceRoot(workspaceDir?: string): string {
  return normalizeWorkspaceDir(workspaceDir) ?? process.cwd();
}
