/** Public SDK protocol helpers for QA channel request and response payloads. */
import { isRecord } from "../shared/record-coerce.js";

/** Conversation category used by QA bus messages and search filters. */
export type QaBusConversationKind = "direct" | "channel" | "group";

/** QA bus conversation metadata visible to channel tests and fixtures. */
export type QaBusConversation = {
  id: string;
  kind: QaBusConversationKind;
  title?: string;
};

/** Attachment payload carried by synthetic QA bus messages. */
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

/** Redacted tool-call summary attached to QA bus messages. */
export type QaBusToolCall = {
  name: string;
  arguments?: Record<string, unknown>;
};

/** Message record stored and emitted by the QA bus. */
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

/** Thread record created inside a QA bus conversation. */
export type QaBusThread = {
  id: string;
  accountId: string;
  conversationId: string;
  title: string;
  createdAt: number;
  createdBy: string;
};

/** Cursor-bearing event emitted by QA bus polling. */
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

/** Input used by tests to inject inbound QA bus messages. */
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

/** Input used by channel code to append outbound QA bus messages. */
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

/** Input for creating a QA bus thread in a conversation. */
export type QaBusCreateThreadInput = {
  accountId?: string;
  conversationId: string;
  title: string;
  createdBy?: string;
  timestamp?: number;
};

/** Input for adding a reaction event to an existing QA bus message. */
export type QaBusReactToMessageInput = {
  accountId?: string;
  messageId: string;
  emoji: string;
  senderId?: string;
  timestamp?: number;
};

/** Input for editing a stored QA bus message. */
export type QaBusEditMessageInput = {
  accountId?: string;
  messageId: string;
  text: string;
  timestamp?: number;
};

/** Input for marking a QA bus message deleted. */
export type QaBusDeleteMessageInput = {
  accountId?: string;
  messageId: string;
  timestamp?: number;
};

/** Search filters for querying QA bus message history. */
export type QaBusSearchMessagesInput = {
  accountId?: string;
  query?: string;
  conversationId?: string;
  threadId?: string;
  limit?: number;
};

/** Lookup input for reading one QA bus message by id. */
export type QaBusReadMessageInput = {
  accountId?: string;
  messageId: string;
};

/** Cursor and timeout options for QA bus event polling. */
export type QaBusPollInput = {
  accountId?: string;
  cursor?: number;
  timeoutMs?: number;
  limit?: number;
};

/** Poll response containing the next cursor and matching events. */
export type QaBusPollResult = {
  cursor: number;
  events: QaBusEvent[];
};

/** Complete QA bus state snapshot for deterministic test assertions. */
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

/** Redacts and bounds arbitrary tool-call arguments before QA bus persistence. */
export function sanitizeQaBusToolCallArguments(
  value: unknown,
): Record<string, unknown> | undefined {
  if (!isRecord(value)) {
    return undefined;
  }
  const sanitized = sanitizeQaBusToolCallValue(value, 0);
  return isRecord(sanitized) ? sanitized : undefined;
}

/** Normalizes a bounded list of tool-call summaries for QA bus messages. */
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

/** Wait predicate used by QA tests to block until an event or message appears. */
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
