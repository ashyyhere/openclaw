// infra node shell helpers and runtime behavior.
import { normalizeLowercaseStringOrEmpty } from "../shared/string-coerce.js";

/** Reused helper for build Node Shell Command behavior in src/infra. */
export function buildNodeShellCommand(command: string, platform?: string | null) {
  const normalized = normalizeLowercaseStringOrEmpty((platform ?? "").trim());
  if (normalized.startsWith("win")) {
    return ["cmd.exe", "/d", "/s", "/c", command];
  }
  return ["/bin/sh", "-lc", command];
}
