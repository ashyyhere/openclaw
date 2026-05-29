// Normalizes path-like strings before extracting file name components.
import path from "node:path";

/** Returns the final basename from either POSIX or Windows style paths. */
export function basenameFromAnyPath(value: string): string {
  return path.win32.basename(path.posix.basename(value));
}

/** Returns the extension from a basename after mixed path separators are stripped. */
export function extnameFromAnyPath(value: string): string {
  return path.extname(basenameFromAnyPath(value));
}

/** Returns the basename without its extension from either POSIX or Windows style paths. */
export function nameFromAnyPath(value: string): string {
  const base = basenameFromAnyPath(value);
  const ext = path.extname(base);
  return path.basename(base, ext);
}
