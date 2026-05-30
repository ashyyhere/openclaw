/** Estimates message size for context-budget and tool-result guards. */
import type { AgentMessage } from "../runtime/index.js";

/** General text-to-token approximation used when only character counts are available. */
export const CHARS_PER_TOKEN_ESTIMATE = 4;
/** Heavier weighting for tool output because JSON/code tends to tokenize densely. */
export const TOOL_RESULT_CHARS_PER_TOKEN_ESTIMATE = 2;
const IMAGE_CHAR_ESTIMATE = 8_000;

/** Weak per-message estimate cache scoped to one context-budget calculation. */
export type MessageCharEstimateCache = WeakMap<AgentMessage, number>;

function isTextBlock(block: unknown): block is { type: "text"; text: string } {
  return (
    !!block &&
    typeof block === "object" &&
    (block as { type?: unknown }).type === "text" &&
    typeof (block as { text?: unknown }).text === "string"
  );
}

function isImageBlock(block: unknown): boolean {
  return !!block && typeof block === "object" && (block as { type?: unknown }).type === "image";
}

function estimateUnknownChars(value: unknown): number {
  if (typeof value === "string") {
    return value.length;
  }
  if (value === undefined) {
    return 0;
  }
  try {
    const serialized = JSON.stringify(value);
    return typeof serialized === "string" ? serialized.length : 0;
  } catch {
    return 256;
  }
}

/** Identifies tool-result messages across SDK and provider-compatible shapes. */
export function isToolResultMessage(msg: AgentMessage): boolean {
  const role = (msg as { role?: unknown }).role;
  const type = (msg as { type?: unknown }).type;
  return role === "toolResult" || role === "tool" || type === "toolResult";
}

function getToolResultContent(msg: AgentMessage): unknown[] {
  if (!isToolResultMessage(msg)) {
    return [];
  }
  const content = (msg as { content?: unknown }).content;
  if (typeof content === "string") {
    return [{ type: "text", text: content }];
  }
  return Array.isArray(content) ? content : [];
}

function estimateContentBlockChars(content: unknown[]): number {
  let chars = 0;
  for (const block of content) {
    if (isTextBlock(block)) {
      chars += block.text.length;
    } else if (isImageBlock(block)) {
      chars += IMAGE_CHAR_ESTIMATE;
    } else {
      chars += estimateUnknownChars(block);
    }
  }
  return chars;
}

/** Extracts plain text from a tool-result message for size accounting. */
export function getToolResultText(msg: AgentMessage): string {
  const content = getToolResultContent(msg);
  const chunks: string[] = [];
  for (const block of content) {
    if (isTextBlock(block)) {
      chunks.push(block.text);
    }
  }
  return chunks.join("\n");
}

function estimateMessageChars(msg: AgentMessage): number {
  if (!msg || typeof msg !== "object") {
    return 0;
  }

  if (msg.role === "user") {
    const content = msg.content;
    if (typeof content === "string") {
      return content.length;
    }
    if (Array.isArray(content)) {
      return estimateContentBlockChars(content);
    }
    return 0;
  }

  if (msg.role === "assistant") {
    let chars = 0;
    const content = (msg as { content?: unknown }).content;
    if (Array.isArray(content)) {
      for (const block of content) {
        if (!block || typeof block !== "object") {
          continue;
        }
        const typed = block as {
          type?: unknown;
          text?: unknown;
          thinking?: unknown;
          arguments?: unknown;
        };
        if (typed.type === "text" && typeof typed.text === "string") {
          chars += typed.text.length;
        } else if (typed.type === "thinking" && typeof typed.thinking === "string") {
          chars += typed.thinking.length;
        } else if (typed.type === "toolCall") {
          try {
            chars += JSON.stringify(typed.arguments ?? {}).length;
          } catch {
            chars += 128;
          }
        } else {
          chars += estimateUnknownChars(block);
        }
      }
    }
    return chars;
  }

  if (isToolResultMessage(msg)) {
    // `details` is stripped before provider conversion; estimate only visible content.
    const content = getToolResultContent(msg);
    const chars = estimateContentBlockChars(content);
    const weightedChars = Math.ceil(
      chars * (CHARS_PER_TOKEN_ESTIMATE / TOOL_RESULT_CHARS_PER_TOKEN_ESTIMATE),
    );
    return Math.max(chars, weightedChars);
  }

  return 256;
}

/** Creates a weak cache keyed by message object identity. */
export function createMessageCharEstimateCache(): MessageCharEstimateCache {
  return new WeakMap<AgentMessage, number>();
}

/** Estimates message characters and reuses cached values for unchanged objects. */
export function estimateMessageCharsCached(
  msg: AgentMessage,
  cache: MessageCharEstimateCache,
): number {
  const hit = cache.get(msg);
  if (hit !== undefined) {
    return hit;
  }
  const estimated = estimateMessageChars(msg);
  cache.set(msg, estimated);
  return estimated;
}

/** Sums cached estimates across a context message list. */
export function estimateContextChars(
  messages: AgentMessage[],
  cache: MessageCharEstimateCache,
): number {
  return messages.reduce((sum, msg) => sum + estimateMessageCharsCached(msg, cache), 0);
}

/** Clears one cached estimate after mutating a message in place. */
export function invalidateMessageCharsCacheEntry(
  cache: MessageCharEstimateCache,
  msg: AgentMessage,
): void {
  cache.delete(msg);
}
