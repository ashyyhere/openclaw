// Chat event reload heuristic. It detects final events that need a history
// refresh because the streamed payload does not contain renderable assistant text.
import { extractText } from "./chat/message-extract.ts";
import type { ChatEventPayload } from "./controllers/chat.ts";
import { normalizeLowercaseStringOrEmpty } from "./string-coerce.ts";

const SILENT_REPLY_PATTERN = /^\s*NO_REPLY\s*$/;

function hasRenderableAssistantFinalMessage(message: unknown): boolean {
  if (!message || typeof message !== "object") {
    return false;
  }
  const entry = message as Record<string, unknown>;
  const role = normalizeLowercaseStringOrEmpty(entry.role);
  if (role && role !== "assistant") {
    return false;
  }
  if (!("content" in entry) && !("text" in entry)) {
    return false;
  }
  const text = extractText(message);
  return typeof text === "string" && text.trim() !== "" && !SILENT_REPLY_PATTERN.test(text);
}

/** Return whether a final chat event should trigger a history reload. */
export function shouldReloadHistoryForFinalEvent(payload?: ChatEventPayload): boolean {
  return Boolean(
    payload && payload.state === "final" && !hasRenderableAssistantFinalMessage(payload.message),
  );
}
