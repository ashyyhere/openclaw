// Voice Call utility helpers normalize user-provided filesystem paths.
import os from "node:os";
import path from "node:path";

/** Resolves a possibly tilde-prefixed user path to an absolute path. */
export function resolveUserPath(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    return trimmed;
  }
  if (trimmed.startsWith("~")) {
    const expanded = trimmed.replace(/^~(?=$|[\\/])/, os.homedir());
    return path.resolve(expanded);
  }
  return path.resolve(trimmed);
}
