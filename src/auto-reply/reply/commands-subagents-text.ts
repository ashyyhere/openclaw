// Text formatting helpers for subagent command output.
import { sanitizeTextContent } from "../../agents/tools/chat-history-text.js";
import { extractTextFromChatContent } from "../../shared/chat-content.js";

/** Shared type for Chat Message in src/auto-reply/reply. */
export type ChatMessage = {
  role?: unknown;
  content?: unknown;
};

/** Reused helper for extract Message Text behavior in src/auto-reply/reply. */
export function extractMessageText(message: ChatMessage): { role: string; text: string } | null {
  const role = typeof message.role === "string" ? message.role : "";
  const shouldSanitize = role === "assistant";
  const text = extractTextFromChatContent(message.content, {
    sanitizeText: shouldSanitize ? sanitizeTextContent : undefined,
  });
  return text ? { role, text } : null;
}
