// Debug command parsing and formatting helpers.
import { parseStandardSetUnsetSlashCommand } from "./commands-setunset-standard.js";

/** Shared type for Debug Command in src/auto-reply/reply. */
export type DebugCommand =
  | { action: "show" }
  | { action: "reset" }
  | { action: "set"; path: string; value: unknown }
  | { action: "unset"; path: string }
  | { action: "error"; message: string };

/** Reused helper for parse Debug Command behavior in src/auto-reply/reply. */
export function parseDebugCommand(raw: string): DebugCommand | null {
  return parseStandardSetUnsetSlashCommand<DebugCommand>({
    raw,
    slash: "/debug",
    invalidMessage: "Invalid /debug syntax.",
    usageMessage: "Usage: /debug show|set|unset|reset",
    onKnownAction: (action) => {
      if (action === "show") {
        return { action: "show" };
      }
      if (action === "reset") {
        return { action: "reset" };
      }
      return undefined;
    },
  });
}
