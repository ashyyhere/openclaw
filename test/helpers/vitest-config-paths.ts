// Vitest config tests use these helpers to normalize absolute paths in snapshots.
import path from "node:path";

/** Normalize an absolute config path to repo-relative POSIX form for stable assertions. */
export function normalizeConfigPath(value: unknown): unknown {
  if (typeof value !== "string" || !path.isAbsolute(value)) {
    return value;
  }
  return path.relative(process.cwd(), value).split(path.sep).join("/");
}

/** Normalize one or many Vitest config paths for snapshot comparisons. */
export function normalizeConfigPaths(
  values: readonly unknown[] | string | undefined,
): unknown[] | undefined {
  if (values === undefined) {
    return undefined;
  }
  if (!Array.isArray(values)) {
    return [normalizeConfigPath(values)];
  }
  return values.map((value) => normalizeConfigPath(value));
}
