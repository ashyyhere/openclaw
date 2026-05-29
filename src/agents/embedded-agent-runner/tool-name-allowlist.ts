/** Builds the session tool allowlist for embedded-agent runtime tools. */
import type { AgentTool } from "../runtime/index.js";
import type { ClientToolDefinition } from "./run/params.js";

/**
 * OpenClaw built-in tools that remain present in the embedded runtime even when
 * OpenClaw routes execution through custom tool definitions.
 */
export const AGENT_RESERVED_TOOL_NAMES = ["bash", "edit", "find", "grep", "ls", "read", "write"];

function addName(names: Set<string>, value: unknown): void {
  if (typeof value !== "string") {
    return;
  }
  const trimmed = value.trim();
  if (trimmed) {
    names.add(trimmed);
  }
}

/** Collects every tool name that a session is allowed to call. */
export function collectAllowedToolNames(params: {
  tools: AgentTool[];
  clientTools?: ClientToolDefinition[];
}): Set<string> {
  const names = new Set<string>();
  for (const tool of params.tools) {
    addName(names, tool.name);
  }
  for (const tool of params.clientTools ?? []) {
    addName(names, tool.function?.name);
  }
  return names;
}

/**
 * Collect the exact tool names registered with the embedded agent for this session.
 */
/** Extracts valid registered tool names from SDK tool definitions. */
export function collectRegisteredToolNames(tools: Array<{ name?: string }>): Set<string> {
  const names = new Set<string>();
  for (const tool of tools) {
    addName(names, tool.name);
  }
  return names;
}

/** Keeps only built-in tool names that are present in the current runtime. */
export function collectCoreBuiltinToolNames(
  tools: Array<{ name?: string }>,
  options?: { isPluginTool?: (tool: { name?: string }) => boolean },
): Set<string> {
  const names = new Set<string>();
  for (const tool of tools) {
    if (options?.isPluginTool?.(tool)) {
      continue;
    }
    addName(names, tool.name);
  }
  return names;
}

/** Serializes the allowlist into stable sorted names for SessionManager config. */
export function toSessionToolAllowlist(allowedToolNames: Iterable<string>): string[] {
  return [...new Set(allowedToolNames)].toSorted((a, b) => a.localeCompare(b));
}
