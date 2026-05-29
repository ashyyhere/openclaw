// security scan paths helpers and runtime behavior.
/** Re-exported API for src/security, starting with is Path Inside. */
export { isPathInside, isPathInsideWithRealpath } from "../infra/path-safety.js";

/** Reused helper for extension Uses Skipped Scanner Path behavior in src/security. */
export function extensionUsesSkippedScannerPath(entry: string): boolean {
  const segments = entry.split(/[\\/]+/).filter(Boolean);
  return segments.some(
    (segment) =>
      segment === "node_modules" ||
      (segment.startsWith(".") && segment !== "." && segment !== ".."),
  );
}
