// JSON file convenience layer backed by fs-safe.
// Saves follow symlink targets so config pointers update the referenced file.
import "./fs-safe-defaults.js";
import fs from "node:fs";
import path from "node:path";
import { tryReadJsonSync, tryReadJson, writeJsonSync } from "@openclaw/fs-safe/json";

/** fs-safe JSON primitives re-exported for legacy infra imports. */
export { tryReadJson, tryReadJsonSync, writeJsonSync };
/** Legacy async JSON reader alias returning null on read/parse failure. */
export const readJsonFile = tryReadJson;

function resolveJsonSymlinkTarget(pathname: string): string | undefined {
  let stat: fs.Stats;
  try {
    stat = fs.lstatSync(pathname);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return undefined;
    }
    throw error;
  }
  if (!stat.isSymbolicLink()) {
    return undefined;
  }

  return path.resolve(path.dirname(pathname), fs.readlinkSync(pathname));
}

function resolveJsonSaveTarget(pathname: string): string {
  const target = resolveJsonSymlinkTarget(pathname);
  if (!target) {
    return pathname;
  }
  fs.statSync(path.dirname(target));
  return target;
}

/** Write JSON, resolving a symlinked pathname to its concrete target first. */
export function saveJsonFile(pathname: string, data: unknown): void {
  writeJsonSync(resolveJsonSaveTarget(pathname), data);
}

export function repairJsonFilePermissions(pathname: string): void {
  const target = resolveJsonSaveTarget(pathname);
  let fd: number | undefined;
  try {
    fd = fs.openSync(
      target,
      fs.constants.O_RDONLY |
        (process.platform !== "win32" && "O_NOFOLLOW" in fs.constants
          ? fs.constants.O_NOFOLLOW
          : 0),
    );
    fs.fchmodSync(fd, 0o600);
  } catch {
    // Matches fs-safe JSON writes: permission repair is best-effort.
  } finally {
    if (fd !== undefined) {
      try {
        fs.closeSync(fd);
      } catch {
        // best-effort cleanup
      }
    }
  }
}

// oxlint-disable-next-line typescript-eslint/no-unnecessary-type-parameters -- legacy typed JSON loader alias.
/** Load typed JSON with symlink fallback, returning undefined for missing/invalid files. */
export function loadJsonFile<T = unknown>(pathname: string): T | undefined {
  const direct = tryReadJsonSync<T>(pathname);
  if (direct !== null) {
    return direct;
  }
  const target = resolveJsonSymlinkTarget(pathname);
  return target ? (tryReadJsonSync<T>(target) ?? undefined) : undefined;
}
