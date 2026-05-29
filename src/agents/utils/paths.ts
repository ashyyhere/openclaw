// Path normalization helpers shared by agent filesystem-facing code.
import { realpathSync } from "node:fs";
import { isAbsolute, relative, resolve as resolvePath, sep } from "node:path";
import { spawnProcessSync } from "./child-process.js";

/**
 * Resolve a path to its canonical (real) form, following symlinks.
 * Falls back to the raw path if resolution fails (e.g. the target does
 * not exist yet), so that callers never crash on missing filesystem
 * entries.
 */
export function canonicalizePath(path: string): string {
  try {
    return realpathSync(path);
  } catch {
    return path;
  }
}

/**
 * Returns true if the value is NOT a package source (npm:, git:, etc.)
 * or a URL protocol. Bare names and relative paths without ./ prefix
 * are considered local.
 */
export function isLocalPath(value: string): boolean {
  const trimmed = value.trim();
  // Known non-local prefixes
  if (
    trimmed.startsWith("npm:") ||
    trimmed.startsWith("git:") ||
    trimmed.startsWith("github:") ||
    trimmed.startsWith("http:") ||
    trimmed.startsWith("https:") ||
    trimmed.startsWith("ssh:")
  ) {
    return false;
  }
  return true;
}

function resolveAgainstCwd(filePath: string, cwd: string): string {
  return isAbsolute(filePath) ? resolvePath(filePath) : resolvePath(cwd, filePath);
}

/** Return a cwd-relative path only when filePath resolves inside cwd. */
export function getCwdRelativePath(filePath: string, cwd: string): string | undefined {
  const resolvedCwd = resolvePath(cwd);
  const resolvedPath = resolveAgainstCwd(filePath, resolvedCwd);
  const relativePath = relative(resolvedCwd, resolvedPath);
  const isInsideCwd =
    relativePath === "" ||
    (relativePath !== ".." && !relativePath.startsWith(`..${sep}`) && !isAbsolute(relativePath));

  return isInsideCwd ? relativePath || "." : undefined;
}

/** Format local paths as cwd-relative slash paths when possible, else absolute. */
export function formatPathRelativeToCwdOrAbsolute(filePath: string, cwd: string): string {
  const absolutePath = resolveAgainstCwd(filePath, cwd);
  return (getCwdRelativePath(absolutePath, cwd) ?? absolutePath).split(sep).join("/");
}

/** Mark local cache/tool paths as ignored by common cloud sync providers. */
export function markPathIgnoredByCloudSync(path: string): void {
  const attrs =
    process.platform === "darwin"
      ? ["com.dropbox.ignored", "com.apple.fileprovider.ignore#P"]
      : process.platform === "linux"
        ? ["user.com.dropbox.ignored"]
        : [];

  for (const attr of attrs) {
    if (process.platform === "darwin") {
      spawnProcessSync("xattr", ["-w", attr, "1", path], { encoding: "utf-8", stdio: "ignore" });
    } else {
      spawnProcessSync("setfattr", ["-n", attr, "-v", "1", path], {
        encoding: "utf-8",
        stdio: "ignore",
      });
    }
  }
}
