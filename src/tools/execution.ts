// Formats tool executor references for logs and diagnostics.
import type { ToolExecutorRef } from "./types.js";

/** Converts a closed executor reference into a stable human-readable string. */
export function formatToolExecutorRef(ref: ToolExecutorRef): string {
  switch (ref.kind) {
    case "core":
      return `core:${ref.executorId}`;
    case "plugin":
      return `plugin:${ref.pluginId}:${ref.toolName}`;
    case "channel":
      return `channel:${ref.channelId}:${ref.actionId}`;
    case "mcp":
      return `mcp:${ref.serverId}:${ref.toolName}`;
    default: {
      const exhaustive: never = ref;
      return exhaustive;
    }
  }
}
