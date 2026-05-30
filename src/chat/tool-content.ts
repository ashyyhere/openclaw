/** Normalizes structured chat tool content blocks for downstream renderers. */
export type ToolContentBlock = Record<string, unknown>;

function normalizeToolContentType(value: unknown): string {
  return typeof value === "string" ? value.toLowerCase() : "";
}

/** Return whether a normalized content block type represents a tool call. */
export function isToolCallContentType(value: unknown): boolean {
  const type = normalizeToolContentType(value);
  return type === "toolcall" || type === "tool_call" || type === "tooluse" || type === "tool_use";
}

/** Return whether a normalized content block type represents a tool result. */
export function isToolResultContentType(value: unknown): boolean {
  const type = normalizeToolContentType(value);
  return type === "toolresult" || type === "tool_result";
}

/** Return whether a structured chat block is a tool-call block. */
export function isToolCallBlock(block: ToolContentBlock): boolean {
  return isToolCallContentType(block.type);
}

/** Return whether a structured chat block is a tool-result block. */
export function isToolResultBlock(block: ToolContentBlock): boolean {
  return isToolResultContentType(block.type);
}

/** Resolve the argument payload field from provider-specific tool-call block shapes. */
export function resolveToolBlockArgs(block: ToolContentBlock): unknown {
  return block.args ?? block.arguments ?? block.input;
}

/** Resolve a stable tool-use id from provider-specific block id fields. */
export function resolveToolUseId(block: ToolContentBlock): string | undefined {
  const id =
    (typeof block.id === "string" && block.id.trim()) ||
    (typeof block.tool_use_id === "string" && block.tool_use_id.trim()) ||
    (typeof block.toolUseId === "string" && block.toolUseId.trim());
  return id || undefined;
}
