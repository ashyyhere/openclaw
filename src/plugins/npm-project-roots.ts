// plugins npm project roots helpers and runtime behavior.
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { resolvePluginNpmProjectsDir } from "./install-paths.js";

function isMissing(error: unknown): boolean {
  return (error as NodeJS.ErrnoException).code === "ENOENT";
}

function sortPaths(paths: string[]): string[] {
  return paths.toSorted((left, right) => left.localeCompare(right));
}

/** Reused helper for list Managed Plugin Npm Project Roots Sync behavior in src/plugins. */
export function listManagedPluginNpmProjectRootsSync(npmRoot: string): string[] {
  const projectsDir = resolvePluginNpmProjectsDir(npmRoot);
  try {
    return sortPaths(
      fs
        .readdirSync(projectsDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => path.join(projectsDir, entry.name)),
    );
  } catch (error) {
    if (isMissing(error)) {
      return [];
    }
    throw error;
  }
}

/** Reused helper for list Managed Plugin Npm Project Roots behavior in src/plugins. */
export async function listManagedPluginNpmProjectRoots(npmRoot: string): Promise<string[]> {
  const projectsDir = resolvePluginNpmProjectsDir(npmRoot);
  try {
    return sortPaths(
      (await fsp.readdir(projectsDir, { withFileTypes: true }))
        .filter((entry) => entry.isDirectory())
        .map((entry) => path.join(projectsDir, entry.name)),
    );
  } catch (error) {
    if (isMissing(error)) {
      return [];
    }
    throw error;
  }
}

/** Reused helper for list Managed Plugin Npm Roots Sync behavior in src/plugins. */
export function listManagedPluginNpmRootsSync(npmRoot: string): string[] {
  return [npmRoot, ...listManagedPluginNpmProjectRootsSync(npmRoot)];
}

/** Reused helper for list Managed Plugin Npm Roots behavior in src/plugins. */
export async function listManagedPluginNpmRoots(npmRoot: string): Promise<string[]> {
  return [npmRoot, ...(await listManagedPluginNpmProjectRoots(npmRoot))];
}
