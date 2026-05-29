/** Container path normalization helpers for sandbox policies. */
import path from "node:path";

/** Normalizes a container path to POSIX absolute-ish form. */
export function normalizeContainerPath(value: string): string {
  const normalized = path.posix.normalize(value);
  return normalized === "." ? "/" : normalized;
}

/** Checks whether a target path remains inside a container root. */
export function isPathInsideContainerRoot(root: string, target: string): boolean {
  const normalizedRoot = normalizeContainerPath(root);
  const normalizedTarget = normalizeContainerPath(target);
  if (normalizedRoot === "/") {
    return true;
  }
  return normalizedTarget === normalizedRoot || normalizedTarget.startsWith(`${normalizedRoot}/`);
}

/** Detects relative paths that escape a container root. */
export function relativePathEscapesContainerRoot(relativePath: string): boolean {
  return (
    relativePath === ".." || relativePath.startsWith("../") || path.posix.isAbsolute(relativePath)
  );
}
