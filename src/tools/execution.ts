// tools execution helpers and runtime behavior.
import type { ToolExecutorRef } from "./types.js";

/** Reused helper for format Tool Executor Ref behavior in src/tools. */
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
