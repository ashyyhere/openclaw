// Builds the platform shell command used by Node process launches.
import { normalizeLowercaseStringOrEmpty } from "../shared/string-coerce.js";

/** Returns Windows or POSIX shell argv for executing one command string. */
export function buildNodeShellCommand(command: string, platform?: string | null) {
  const normalized = normalizeLowercaseStringOrEmpty((platform ?? "").trim());
  if (normalized.startsWith("win")) {
    return ["cmd.exe", "/d", "/s", "/c", command];
  }
  return ["/bin/sh", "-lc", command];
}
