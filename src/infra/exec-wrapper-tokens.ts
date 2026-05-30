// Normalizes executable tokens for wrapper and carrier command detection.
import path from "node:path";
import { normalizeLowercaseStringOrEmpty } from "../shared/string-coerce.js";

const WINDOWS_EXECUTABLE_SUFFIXES = [".exe", ".cmd", ".bat", ".com"] as const;

function stripWindowsExecutableSuffix(value: string): string {
  for (const suffix of WINDOWS_EXECUTABLE_SUFFIXES) {
    if (value.endsWith(suffix)) {
      return value.slice(0, -suffix.length);
    }
  }
  return value;
}

/** Returns the lowercased basename using the shorter Windows/POSIX split result. */
export function basenameLower(token: string): string {
  const win = path.win32.basename(token);
  const posix = path.posix.basename(token);
  const base = win.length < posix.length ? win : posix;
  return normalizeLowercaseStringOrEmpty(base);
}

/** Returns a lowercased executable basename without Windows executable suffixes. */
export function normalizeExecutableToken(token: string): string {
  return stripWindowsExecutableSuffix(basenameLower(token));
}
