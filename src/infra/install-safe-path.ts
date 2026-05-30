// Re-exports safe install path helpers and compares plugin ids to package names.
import "./fs-safe-defaults.js";
/** Safe install path primitives from fs-safe with infra defaults initialized. */
export {
  assertCanonicalPathWithinBase,
  resolveSafeInstallDir,
  safeDirName,
  safePathSegmentHashed,
} from "@openclaw/fs-safe/advanced";

/** Returns the package basename so scoped package names can match plugin ids. */
export function unscopedPackageName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    return trimmed;
  }
  return trimmed.includes("/") ? (trimmed.split("/").pop() ?? trimmed) : trimmed;
}

/** Checks whether a package name matches a plugin id directly or after removing scope. */
export function packageNameMatchesId(packageName: string, id: string): boolean {
  const trimmedId = id.trim();
  if (!trimmedId) {
    return false;
  }

  const trimmedPackageName = packageName.trim();
  if (!trimmedPackageName) {
    return false;
  }

  return trimmedId === trimmedPackageName || trimmedId === unscopedPackageName(trimmedPackageName);
}
