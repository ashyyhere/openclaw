// media file name helpers and runtime behavior.
import path from "node:path";

/** Reused helper for basename From Any Path behavior in src/media. */
export function basenameFromAnyPath(value: string): string {
  return path.win32.basename(path.posix.basename(value));
}

/** Reused helper for extname From Any Path behavior in src/media. */
export function extnameFromAnyPath(value: string): string {
  return path.extname(basenameFromAnyPath(value));
}

/** Reused helper for name From Any Path behavior in src/media. */
export function nameFromAnyPath(value: string): string {
  const base = basenameFromAnyPath(value);
  const ext = path.extname(base);
  return path.basename(base, ext);
}
