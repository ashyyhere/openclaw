// MCP command parsing helpers.
import { parseStandardSetUnsetSlashCommand } from "./commands-setunset-standard.js";

/** Shared type for Mcp Command in src/auto-reply/reply. */
export type McpCommand =
  | { action: "show"; name?: string }
  | { action: "set"; name: string; value: unknown }
  | { action: "unset"; name: string }
  | { action: "error"; message: string };

/** Reused helper for parse Mcp Command behavior in src/auto-reply/reply. */
export function parseMcpCommand(raw: string): McpCommand | null {
  return parseStandardSetUnsetSlashCommand<McpCommand>({
    raw,
    slash: "/mcp",
    invalidMessage: "Invalid /mcp syntax.",
    usageMessage: "Usage: /mcp show|set|unset",
    onKnownAction: (action, args) => {
      if (action === "show" || action === "get") {
        return { action: "show", name: args || undefined };
      }
      return undefined;
    },
    onSet: (name, value) => ({ action: "set", name, value }),
    onUnset: (name) => ({ action: "unset", name }),
  });
}
