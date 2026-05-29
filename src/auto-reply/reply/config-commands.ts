// Config command parser and command text helpers.
import { parseStandardSetUnsetSlashCommand } from "./commands-setunset-standard.js";

/** Shared type for Config Command in src/auto-reply/reply. */
export type ConfigCommand =
  | { action: "show"; path?: string }
  | { action: "set"; path: string; value: unknown }
  | { action: "unset"; path: string }
  | { action: "error"; message: string };

/** Reused helper for parse Config Command behavior in src/auto-reply/reply. */
export function parseConfigCommand(raw: string): ConfigCommand | null {
  return parseStandardSetUnsetSlashCommand<ConfigCommand>({
    raw,
    slash: "/config",
    invalidMessage: "Invalid /config syntax.",
    usageMessage: "Usage: /config show|set|unset",
    onKnownAction: (action, args) => {
      if (action === "show" || action === "get") {
        return { action: "show", path: args || undefined };
      }
      return undefined;
    },
  });
}
