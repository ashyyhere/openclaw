/** Public SDK protocol helpers for QA channel request and response payloads. */
import { isRecord } from "../shared/record-coerce.js";

/** Shared type for Qa Bus Conversation Kind in src/plugin-sdk. */
export type QaBusConversationKind = "direct" | "channel" | "group";

/** Shared type for Qa Bus Conversation in src/plugin-sdk. */
export type QaBusConversation = {
  id: string;
  kind: QaBusConversationKind;
  title?: string;
};

/** Shared type for Qa Bus Attachment in src/plugin-sdk. */
export type QaBusAttachment = {
  id: string;
  kind: "image" | "video" | "audio" | "file";
  mimeType: string;
  fileName?: string;
  inline?: boolean;
  url?: string;
  contentBase64?: string;
  width?: number;
  height?: number;
  durationMs?: number;
  altText?: string;
  transcript?: string;
};

/** Shared type for Qa Bus Tool Call in src/plugin-sdk. */
export type QaBusToolCall = {
  name: string;
  arguments?: Record<string, unknown>;
};

/** Shared type for Qa Bus Message in src/plugin-sdk. */
export type QaBusMessage = {
  id: string;
  accountId: string;
  direction: "inbound" | "outbound";
  conversation: QaBusConversation;
  senderId: string;
  senderName?: string;
  text: string;
  timestamp: number;
  threadId?: string;
  threadTitle?: string;
  replyToId?: string;
  deleted?: boolean;
  editedAt?: number;
  attachments?: QaBusAttachment[];
  toolCalls?: QaBusToolCall[];
  reactions: Array<{
    emoji: string;
    senderId: string;
    timestamp: number;
  }>;
};

/** Shared type for Qa Bus Thread in src/plugin-sdk. */
export type QaBusThread = {
  id: string;
  accountId: string;
  conversationId: string;
  title: string;
  createdAt: number;
  createdBy: string;
};

/** Shared type for Qa Bus Event in src/plugin-sdk. */
export type QaBusEvent =
  | { cursor: number; kind: "inbound-message"; accountId: string; message: QaBusMessage }
  | { cursor: number; kind: "outbound-message"; accountId: string; message: QaBusMessage }
  | { cursor: number; kind: "thread-created"; accountId: string; thread: QaBusThread }
  | { cursor: number; kind: "message-edited"; accountId: string; message: QaBusMessage }
  | { cursor: number; kind: "message-deleted"; accountId: string; message: QaBusMessage }
  | {
      cursor: number;
      kind: "reaction-added";
      accountId: string;
      message: QaBusMessage;
      emoji: string;
      senderId: string;
    };

/** Shared type for Qa Bus Inbound Message Input in src/plugin-sdk. */
export type QaBusInboundMessageInput = {
  accountId?: string;
  conversation: QaBusConversation;
  senderId: string;
  senderName?: string;
  text: string;
  timestamp?: number;
  threadId?: string;
  threadTitle?: string;
  replyToId?: string;
  attachments?: QaBusAttachment[];
  toolCalls?: QaBusToolCall[];
};

/** Shared type for Qa Bus Outbound Message Input in src/plugin-sdk. */
export type QaBusOutboundMessageInput = {
  accountId?: string;
  to: string;
  senderId?: string;
  senderName?: string;
  text: string;
  timestamp?: number;
  threadId?: string;
  replyToId?: string;
  attachments?: QaBusAttachment[];
  toolCalls?: QaBusToolCall[];
};

/** Shared type for Qa Bus Create Thread Input in src/plugin-sdk. */
export type QaBusCreateThreadInput = {
  accountId?: string;
  conversationId: string;
  title: string;
  createdBy?: string;
  timestamp?: number;
};

/** Shared type for Qa Bus React To Message Input in src/plugin-sdk. */
export type QaBusReactToMessageInput = {
  accountId?: string;
  messageId: string;
  emoji: string;
  senderId?: string;
  timestamp?: number;
};

/** Shared type for Qa Bus Edit Message Input in src/plugin-sdk. */
export type QaBusEditMessageInput = {
  accountId?: string;
  messageId: string;
  text: string;
  timestamp?: number;
};

/** Shared type for Qa Bus Delete Message Input in src/plugin-sdk. */
export type QaBusDeleteMessageInput = {
  accountId?: string;
  messageId: string;
  timestamp?: number;
};

/** Shared type for Qa Bus Search Messages Input in src/plugin-sdk. */
export type QaBusSearchMessagesInput = {
  accountId?: string;
  query?: string;
  conversationId?: string;
  threadId?: string;
  limit?: number;
};

/** Shared type for Qa Bus Read Message Input in src/plugin-sdk. */
export type QaBusReadMessageInput = {
  accountId?: string;
  messageId: string;
};

/** Shared type for Qa Bus Poll Input in src/plugin-sdk. */
export type QaBusPollInput = {
  accountId?: string;
  cursor?: number;
  timeoutMs?: number;
  limit?: number;
};

/** Shared type for Qa Bus Poll Result in src/plugin-sdk. */
export type QaBusPollResult = {
  cursor: number;
  events: QaBusEvent[];
};

/** Shared type for Qa Bus State Snapshot in src/plugin-sdk. */
export type QaBusStateSnapshot = {
  cursor: number;
  conversations: QaBusConversation[];
  threads: QaBusThread[];
  messages: QaBusMessage[];
  events: QaBusEvent[];
};

const QA_BUS_TOOL_CALL_MAX_COUNT = 50;
const QA_BUS_TOOL_CALL_MAX_DEPTH = 4;
const QA_BUS_TOOL_CALL_MAX_ARRAY_LENGTH = 20;
const QA_BUS_TOOL_CALL_MAX_OBJECT_KEYS = 40;
const QA_BUS_TOOL_CALL_REDACTED = "[redacted]";

const QA_BUS_TOOL_CALL_SENSITIVE_KEY_RE =
  /authorization|cookie|credential|password|secret|token|api[-_]?key|access[-_]?key|private[-_]?key/iu;

function sanitizeQaBusToolCallValue(value: unknown, depth: number, key?: string): unknown {
  if (key && QA_BUS_TOOL_CALL_SENSITIVE_KEY_RE.test(key)) {
    return QA_BUS_TOOL_CALL_REDACTED;
  }
  if (value === null || typeof value === "boolean" || typeof value === "number") {
    return Number.isFinite(value as number) || typeof value !== "number" ? value : String(value);
  }
  if (typeof value === "string") {
    // Tool args often embed credentials in command/header/env shapes; keep structure, not raw text.
    return QA_BUS_TOOL_CALL_REDACTED;
  }
  if (typeof value === "bigint") {
    return value.toString();
  }
  if (value === undefined || typeof value === "function" || typeof value === "symbol") {
    return undefined;
  }
  if (depth >= QA_BUS_TOOL_CALL_MAX_DEPTH) {
    return "[truncated]";
  }
  if (Array.isArray(value)) {
    return value.slice(0, QA_BUS_TOOL_CALL_MAX_ARRAY_LENGTH).map((entry) => {
      return sanitizeQaBusToolCallValue(entry, depth + 1);
    });
  }
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .slice(0, QA_BUS_TOOL_CALL_MAX_OBJECT_KEYS)
        .flatMap(([entryKey, entryValue]) => {
          const sanitized = sanitizeQaBusToolCallValue(entryValue, depth + 1, entryKey);
          return sanitized === undefined ? [] : [[entryKey, sanitized]];
        }),
    );
  }
  return undefined;
}

/** Reused helper for sanitize Qa Bus Tool Call Arguments behavior in src/plugin-sdk. */
export function sanitizeQaBusToolCallArguments(
  value: unknown,
): Record<string, unknown> | undefined {
  if (!isRecord(value)) {
    return undefined;
  }
  const sanitized = sanitizeQaBusToolCallValue(value, 0);
  return isRecord(sanitized) ? sanitized : undefined;
}

/** Reused helper for sanitize Qa Bus Tool Calls behavior in src/plugin-sdk. */
export function sanitizeQaBusToolCalls(value: unknown): QaBusToolCall[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const sanitized = value.slice(0, QA_BUS_TOOL_CALL_MAX_COUNT).flatMap((toolCall) => {
    if (!isRecord(toolCall)) {
      return [];
    }
    const name = typeof toolCall.name === "string" ? toolCall.name.trim() : "";
    if (!name) {
      return [];
    }
    const args = sanitizeQaBusToolCallArguments(toolCall.arguments);
    return [
      {
        name,
        ...(args && Object.keys(args).length > 0 ? { arguments: args } : {}),
      },
    ];
  });
  return sanitized.length > 0 ? sanitized : undefined;
}

/** Shared type for Qa Bus Wait For Input in src/plugin-sdk. */
export type QaBusWaitForInput =
  | {
      timeoutMs?: number;
      kind: "event-kind";
      eventKind: QaBusEvent["kind"];
    }
  | {
      timeoutMs?: number;
      kind: "message-text";
      textIncludes: string;
      direction?: QaBusMessage["direction"];
    }
  | {
      timeoutMs?: number;
      kind: "thread-id";
      threadId: string;
    };
