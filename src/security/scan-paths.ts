// Scanner path safety helpers and skipped-path detection.
/** Re-export path containment helpers used by security scanners. */
export { isPathInside, isPathInsideWithRealpath } from "../infra/path-safety.js";

/** Return whether an extension path includes directories scanners intentionally skip. */
export function extensionUsesSkippedScannerPath(entry: string): boolean {
  const segments = entry.split(/[\\/]+/).filter(Boolean);
  return segments.some(
    (segment) =>
      segment === "node_modules" ||
      (segment.startsWith(".") && segment !== "." && segment !== ".."),
  );
}
