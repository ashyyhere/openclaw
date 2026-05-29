/** Public SDK helpers for canonical channel route identity, matching, and compact keys. */
import { normalizeOptionalAccountId } from "../routing/account-id.js";
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalString,
  normalizeOptionalThreadValue,
} from "../shared/string-coerce.js";

/** Conversation shape for a normalized channel route target. */
export type ChannelRouteChatType = "direct" | "group" | "channel";

/** Thread identifier family used by a normalized channel route. */
export type ChannelRouteThreadKind = "topic" | "thread" | "reply";

/** Source that supplied the thread id for route comparisons and diagnostics. */
export type ChannelRouteThreadSource = "explicit" | "target" | "session" | "turn";

/** Canonical channel route reference used for delivery, dedupe, and matching. */
export type ChannelRouteRef = {
  channel?: string;
  accountId?: string;
  target?: {
    to: string;
    rawTo?: string;
    chatType?: ChannelRouteChatType;
  };
  thread?: {
    id: string | number;
    kind?: ChannelRouteThreadKind;
    source?: ChannelRouteThreadSource;
  };
};

/** Shared type for Channel Route Ref Input in src/plugin-sdk. */
export type ChannelRouteRefInput = {
  channel?: unknown;
  accountId?: unknown;
  to?: unknown;
  rawTo?: unknown;
  chatType?: ChannelRouteChatType;
  threadId?: unknown;
  threadKind?: ChannelRouteThreadKind;
  threadSource?: ChannelRouteThreadSource;
};

/** Shared type for Channel Route Target Input in src/plugin-sdk. */
export type ChannelRouteTargetInput = Pick<
  ChannelRouteRefInput,
  "channel" | "accountId" | "to" | "rawTo" | "chatType" | "threadId"
>;

/** Shared type for Channel Route Key Input in src/plugin-sdk. */
export type ChannelRouteKeyInput = ChannelRouteRef | ChannelRouteTargetInput;

/** @deprecated Use `messaging.resolveOutboundSessionRoute` for provider-specific target grammar. */
export type ChannelRouteExplicitTarget = {
  to: string;
  threadId?: string | number;
  chatType?: ChannelRouteChatType;
};

/** @deprecated Use `messaging.resolveOutboundSessionRoute` for provider-specific target grammar. */
export type ChannelRouteExplicitTargetParser = (
  channel: string,
  rawTarget: string,
) => ChannelRouteExplicitTarget | null;

/** Normalize thread ids while preserving string/number identity for channel APIs. */
export function normalizeRouteThreadId(value: unknown): string | number | undefined {
  return normalizeOptionalThreadValue(value);
}

/** Convert a normalized thread id into the string form used by keys. */
export function stringifyRouteThreadId(value: unknown): string | undefined {
  const normalized = normalizeRouteThreadId(value);
  return normalized == null ? undefined : String(normalized);
}

/** Normalize raw route fields into a compact route ref, dropping empty values. */
export function normalizeChannelRouteRef(
  input?: ChannelRouteRefInput,
): ChannelRouteRef | undefined {
  if (!input) {
    return undefined;
  }
  const channel = normalizeLowercaseStringOrEmpty(input.channel);
  const accountId =
    typeof input.accountId === "string" ? normalizeOptionalAccountId(input.accountId) : undefined;
  const to = normalizeOptionalString(input.to);
  const rawTo = normalizeOptionalString(input.rawTo);
  const threadId = normalizeRouteThreadId(input.threadId);
  if (!channel && !to && !accountId && threadId == null) {
    return undefined;
  }
  return {
    ...(channel ? { channel } : {}),
    ...(accountId ? { accountId } : {}),
    ...(to
      ? {
          target: {
            to,
            ...(rawTo && rawTo !== to ? { rawTo } : {}),
            ...(input.chatType ? { chatType: input.chatType } : {}),
          },
        }
      : {}),
    ...(threadId != null
      ? {
          thread: {
            id: threadId,
            ...(input.threadKind ? { kind: input.threadKind } : {}),
            ...(input.threadSource ? { source: input.threadSource } : {}),
          },
        }
      : {}),
  };
}

/** Reused helper for channel Route Target behavior in src/plugin-sdk. */
export function channelRouteTarget(route?: ChannelRouteRef): string | undefined {
  return route?.target?.to;
}

/** Reused helper for channel Route Thread Id behavior in src/plugin-sdk. */
export function channelRouteThreadId(route?: ChannelRouteRef): string | number | undefined {
  return route?.thread?.id;
}

/** Reused helper for normalize Channel Route Target behavior in src/plugin-sdk. */
export function normalizeChannelRouteTarget(
  input?: ChannelRouteTargetInput | null,
): ChannelRouteRef | undefined {
  return input ? normalizeChannelRouteRef(input) : undefined;
}

/** Shared type for Channel Route Parsed Target in src/plugin-sdk. */
export type ChannelRouteParsedTarget = ChannelRouteTargetInput & {
  channel: string;
  rawTo: string;
  to: string;
  threadId?: string | number;
  chatType?: ChannelRouteChatType;
};

/** @deprecated Use `messaging.resolveOutboundSessionRoute` for provider-specific target grammar. */
export function resolveChannelRouteTargetWithParser(params: {
  channel: string;
  rawTarget?: string | null;
  fallbackThreadId?: string | number | null;
  parseExplicitTarget: ChannelRouteExplicitTargetParser;
}): ChannelRouteParsedTarget | null {
  const channel = normalizeLowercaseStringOrEmpty(params.channel);
  const rawTo = normalizeOptionalString(params.rawTarget);
  if (!channel || !rawTo) {
    return null;
  }
  const parsed = params.parseExplicitTarget(channel, rawTo);
  const fallbackThreadId = normalizeOptionalThreadValue(params.fallbackThreadId);
  return {
    channel,
    rawTo,
    to: parsed?.to ?? rawTo,
    threadId: normalizeOptionalThreadValue(parsed?.threadId ?? fallbackThreadId),
    chatType: parsed?.chatType,
  };
}

/** Build a stable dedupe key where missing fields are represented explicitly. */
export function channelRouteDedupeKey(input?: ChannelRouteTargetInput | null): string {
  const route = normalizeChannelRouteTarget(input);
  return JSON.stringify([
    route?.channel ?? "",
    route?.target?.to ?? "",
    route?.accountId ?? "",
    stringifyRouteThreadId(route?.thread?.id) ?? "",
  ]);
}

/** @deprecated Use `channelRouteDedupeKey`. */
export function channelRouteIdentityKey(input?: ChannelRouteTargetInput | null): string {
  return channelRouteDedupeKey(input);
}

function threadIdsEqual(left?: string | number, right?: string | number): boolean {
  const normalizedLeft = stringifyRouteThreadId(left);
  const normalizedRight = stringifyRouteThreadId(right);
  return normalizedLeft === normalizedRight;
}

function accountsCompatible(left?: string, right?: string): boolean {
  // Conversation sharing treats an unspecified account as compatible with a specified account,
  // while exact matching below requires both sides to agree.
  return !left || !right || left === right;
}

function accountsEqual(left?: string, right?: string): boolean {
  return (left ?? "") === (right ?? "");
}

/** Return true only when channel, target, account, and thread match exactly. */
export function channelRoutesMatchExact(params: {
  left?: ChannelRouteRef | null;
  right?: ChannelRouteRef | null;
}): boolean {
  const { left, right } = params;
  if (!left || !right) {
    return false;
  }
  return (
    left.channel === right.channel &&
    left.target?.to === right.target?.to &&
    accountsEqual(left.accountId, right.accountId) &&
    threadIdsEqual(left.thread?.id, right.thread?.id)
  );
}

/** Return true when two routes point at the same conversation even if one side omits account/thread. */
export function channelRoutesShareConversation(params: {
  left?: ChannelRouteRef | null;
  right?: ChannelRouteRef | null;
}): boolean {
  const { left, right } = params;
  if (!left || !right) {
    return false;
  }
  if (
    left.channel !== right.channel ||
    left.target?.to !== right.target?.to ||
    !accountsCompatible(left.accountId, right.accountId)
  ) {
    return false;
  }
  if (left.thread?.id == null || right.thread?.id == null) {
    return true;
  }
  return threadIdsEqual(left.thread.id, right.thread.id);
}

/** Reused helper for channel Route Targets Match Exact behavior in src/plugin-sdk. */
export function channelRouteTargetsMatchExact(params: {
  left?: ChannelRouteTargetInput | null;
  right?: ChannelRouteTargetInput | null;
}): boolean {
  return channelRoutesMatchExact({
    left: normalizeChannelRouteTarget(params.left),
    right: normalizeChannelRouteTarget(params.right),
  });
}

/** Reused helper for channel Route Targets Share Conversation behavior in src/plugin-sdk. */
export function channelRouteTargetsShareConversation(params: {
  left?: ChannelRouteTargetInput | null;
  right?: ChannelRouteTargetInput | null;
}): boolean {
  return channelRoutesShareConversation({
    left: normalizeChannelRouteTarget(params.left),
    right: normalizeChannelRouteTarget(params.right),
  });
}

function isChannelRouteRef(route: ChannelRouteKeyInput): route is ChannelRouteRef {
  return "target" in route || "thread" in route;
}

function normalizeChannelRouteKeyInput(
  route?: ChannelRouteKeyInput | null,
): ChannelRouteRef | undefined {
  if (!route) {
    return undefined;
  }
  return isChannelRouteRef(route)
    ? normalizeChannelRouteRef({
        channel: route.channel,
        to: route.target?.to,
        accountId: route.accountId,
        threadId: route.thread?.id,
      })
    : normalizeChannelRouteTarget(route);
}

/** Build the compact route key used in logs and route indexes. */
export function channelRouteCompactKey(route?: ChannelRouteKeyInput | null): string | undefined {
  const normalized = normalizeChannelRouteKeyInput(route);
  if (!normalized?.channel || !normalized.target?.to) {
    return undefined;
  }
  return [
    normalized.channel,
    normalized.target.to,
    normalized.accountId ?? "",
    stringifyRouteThreadId(normalized.thread?.id) ?? "",
  ].join("|");
}

/** @deprecated Use `channelRouteCompactKey`. */
export function channelRouteKey(route?: ChannelRouteRef): string | undefined {
  return channelRouteCompactKey(route);
}
