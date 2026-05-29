/** Normalizes structured chat tool content blocks for downstream renderers. */
export type ToolContentBlock = Record<string, unknown>;

function normalizeToolContentType(value: unknown): string {
  return typeof value === "string" ? value.toLowerCase() : "";
}

/** Reused helper for is Tool Call Content Type behavior in src/chat. */
export function isToolCallContentType(value: unknown): boolean {
  const type = normalizeToolContentType(value);
  return type === "toolcall" || type === "tool_call" || type === "tooluse" || type === "tool_use";
}

/** Reused helper for is Tool Result Content Type behavior in src/chat. */
export function isToolResultContentType(value: unknown): boolean {
  const type = normalizeToolContentType(value);
  return type === "toolresult" || type === "tool_result";
}

/** Reused helper for is Tool Call Block behavior in src/chat. */
export function isToolCallBlock(block: ToolContentBlock): boolean {
  return isToolCallContentType(block.type);
}

/** Reused helper for is Tool Result Block behavior in src/chat. */
export function isToolResultBlock(block: ToolContentBlock): boolean {
  return isToolResultContentType(block.type);
}

/** Reused helper for resolve Tool Block Args behavior in src/chat. */
export function resolveToolBlockArgs(block: ToolContentBlock): unknown {
  return block.args ?? block.arguments ?? block.input;
}

/** Reused helper for resolve Tool Use Id behavior in src/chat. */
export function resolveToolUseId(block: ToolContentBlock): string | undefined {
  const id =
    (typeof block.id === "string" && block.id.trim()) ||
    (typeof block.tool_use_id === "string" && block.tool_use_id.trim()) ||
    (typeof block.toolUseId === "string" && block.toolUseId.trim());
  return id || undefined;
}
