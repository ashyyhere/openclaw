// Shared MCP channel payload types, schemas, and event projection helpers.
import { z } from "zod";
import {
  normalizeOptionalLowercaseString,
  normalizeOptionalString as toText,
} from "../shared/string-coerce.js";

/** Claude channel notification mode advertised by the MCP bridge. */
export type ClaudeChannelMode = "off" | "on" | "auto";

/** Normalized channel conversation descriptor exposed to MCP clients. */
export type ConversationDescriptor = {
  sessionKey: string;
  channel: string;
  to: string;
  accountId?: string;
  threadId?: string | number;
  label?: string;
  displayName?: string;
  derivedTitle?: string;
  lastMessagePreview?: string;
  updatedAt?: number | null;
};

type SessionRow = {
  key: string;
  channel?: string;
  lastChannel?: string;
  lastTo?: string;
  lastAccountId?: string;
  lastThreadId?: string | number;
  deliveryContext?: {
    channel?: string;
    to?: string;
    accountId?: string;
    threadId?: string | number;
  };
  origin?: {
    provider?: string;
    accountId?: string;
    threadId?: string | number;
  };
  label?: string;
  displayName?: string;
  derivedTitle?: string;
  lastMessagePreview?: string;
  updatedAt?: number | null;
};

/** Gateway session-list response shape consumed by the bridge. */
export type SessionListResult = {
  sessions?: SessionRow[];
};

/** Gateway session-describe response shape consumed by the bridge. */
export type SessionDescribeResult = {
  session?: SessionRow | null;
};

/** Gateway chat-history response shape consumed by the bridge. */
export type ChatHistoryResult = {
  messages?: Array<{ id?: string; role?: string; content?: unknown; [key: string]: unknown }>;
};

/** Gateway session-message payload shape normalized into MCP queue events. */
export type SessionMessagePayload = {
  sessionKey?: string;
  messageId?: string;
  messageSeq?: number;
  message?: { role?: string; content?: unknown; [key: string]: unknown };
  lastChannel?: string;
  lastTo?: string;
  lastAccountId?: string;
  lastThreadId?: string | number;
  [key: string]: unknown;
};

/** Approval request families forwarded through the MCP event queue. */
export type ApprovalKind = "exec" | "plugin";
/** Approval decisions accepted from MCP callers. */
export type ApprovalDecision = "allow-once" | "allow-always" | "deny";

/** Pending gateway approval retained until a client resolves or it expires. */
export type PendingApproval = {
  kind: ApprovalKind;
  id: string;
  request?: Record<string, unknown>;
  createdAtMs?: number;
  expiresAtMs?: number;
};

/** Event queue item emitted to MCP clients waiting for channel or approval updates. */
export type QueueEvent =
  | {
      cursor: number;
      type: "message";
      sessionKey: string;
      conversation?: ConversationDescriptor;
      messageId?: string;
      messageSeq?: number;
      role?: string;
      text?: string;
      raw: SessionMessagePayload;
    }
  | {
      cursor: number;
      type: "claude_permission_request";
      requestId: string;
      toolName: string;
      description: string;
      inputPreview: string;
    }
  | {
      cursor: number;
      type: "exec_approval_requested" | "exec_approval_resolved";
      raw: Record<string, unknown>;
    }
  | {
      cursor: number;
      type: "plugin_approval_requested" | "plugin_approval_resolved";
      raw: Record<string, unknown>;
    };

/** Claude channel permission notification payload tracked for yes/no replies. */
export type ClaudePermissionRequest = {
  toolName: string;
  description: string;
  inputPreview: string;
};

/** Cursor and optional session filter used by event wait calls. */
export type WaitFilter = {
  afterCursor: number;
  sessionKey?: string;
};

/** MCP notification schema for Claude channel permission requests. */
export const ClaudePermissionRequestSchema = z.object({
  method: z.literal("notifications/claude/channel/permission_request"),
  params: z.object({
    request_id: z.string(),
    tool_name: z.string(),
    description: z.string(),
    input_preview: z.string(),
  }),
});

/** Shared string coercion helper used by channel projection code. */
export { toText };

/** Resolves a message id from either direct fields or OpenClaw metadata. */
export function resolveMessageId(entry: Record<string, unknown>): string | undefined {
  return (
    toText(entry.id) ??
    (entry["__openclaw"] && typeof entry["__openclaw"] === "object"
      ? toText((entry["__openclaw"] as { id?: unknown }).id)
      : undefined)
  );
}

/** Builds a text-only MCP result summary for count-based tools. */
export function summarizeResult(
  label: string,
  count: number,
): { content: Array<{ type: "text"; text: string }> } {
  return {
    content: [{ type: "text", text: `${label}: ${count}` }],
  };
}

/** Builds a text summary plus serialized payload for structured MCP tool results. */
export function summarizeStructuredResult(
  label: string,
  count: number,
  payload: unknown,
): { content: Array<{ type: "text"; text: string }> } {
  return {
    content: [{ type: "text", text: `${label}: ${count}\n\n${JSON.stringify(payload, null, 2)}` }],
  };
}

function resolveConversationChannel(row: SessionRow): string | undefined {
  return normalizeOptionalLowercaseString(
    toText(row.deliveryContext?.channel) ??
      toText(row.lastChannel) ??
      toText(row.channel) ??
      toText(row.origin?.provider),
  );
}

/** Projects gateway session rows into channel conversation descriptors. */
export function toConversation(row: SessionRow): ConversationDescriptor | null {
  const channel = resolveConversationChannel(row);
  const to = toText(row.deliveryContext?.to) ?? toText(row.lastTo);
  if (!channel || !to) {
    return null;
  }
  return {
    sessionKey: row.key,
    channel,
    to,
    accountId:
      toText(row.deliveryContext?.accountId) ??
      toText(row.lastAccountId) ??
      toText(row.origin?.accountId),
    threadId: row.deliveryContext?.threadId ?? row.lastThreadId ?? row.origin?.threadId,
    label: toText(row.label),
    displayName: toText(row.displayName),
    derivedTitle: toText(row.derivedTitle),
    lastMessagePreview: toText(row.lastMessagePreview),
    updatedAt: typeof row.updatedAt === "number" ? row.updatedAt : null,
  };
}

/** Checks whether a queued event is newer than and relevant to a wait filter. */
export function matchEventFilter(event: QueueEvent, filter: WaitFilter): boolean {
  if (event.cursor <= filter.afterCursor) {
    return false;
  }
  if (!filter.sessionKey) {
    return true;
  }
  return "sessionKey" in event && event.sessionKey === filter.sessionKey;
}

/** Extracts non-text message content blocks for MCP message reads. */
export function extractAttachmentsFromMessage(message: unknown): unknown[] {
  if (!message || typeof message !== "object") {
    return [];
  }
  const content = (message as { content?: unknown }).content;
  if (!Array.isArray(content)) {
    return [];
  }
  return content.filter((entry) => {
    if (!entry || typeof entry !== "object") {
      return false;
    }
    return toText((entry as { type?: unknown }).type) !== "text";
  });
}

/** Normalizes optional approval ids before gateway resolution calls. */
export function normalizeApprovalId(value: unknown): string | undefined {
  const id = toText(value);
  return id ? id.trim() : undefined;
}
