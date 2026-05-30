// Resolves stable conversation ids from thread ids and outbound targets.
import { stringifyRouteThreadId } from "../../plugin-sdk/channel-route.js";
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalString,
} from "../../shared/string-coerce.js";

function resolveExplicitConversationTargetId(target: string): string | undefined {
  for (const prefix of ["channel:", "conversation:", "group:", "room:", "dm:"]) {
    if (normalizeLowercaseStringOrEmpty(target).startsWith(prefix)) {
      return normalizeOptionalString(target.slice(prefix.length));
    }
  }
  return undefined;
}

/** Picks the best conversation id from explicit thread, target prefixes, or numeric ids. */
export function resolveConversationIdFromTargets(params: {
  threadId?: string | number;
  targets: Array<string | undefined | null>;
}): string | undefined {
  const threadId = stringifyRouteThreadId(params.threadId);
  if (threadId) {
    return threadId;
  }

  for (const rawTarget of params.targets) {
    const target = normalizeOptionalString(rawTarget);
    if (!target) {
      continue;
    }
    const explicitConversationId = resolveExplicitConversationTargetId(target);
    if (explicitConversationId) {
      return explicitConversationId;
    }
    if (target.includes(":") && explicitConversationId === undefined) {
      continue;
    }
    const mentionMatch = target.match(/^<#(\d+)>$/);
    if (mentionMatch?.[1]) {
      return mentionMatch[1];
    }
    if (/^\d{6,}$/.test(target)) {
      return target;
    }
  }

  return undefined;
}
