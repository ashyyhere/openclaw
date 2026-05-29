// Base reply payload construction helpers.
import type { ReplyToMode } from "../../config/types.js";
import { hasReplyPayloadContent } from "../../interactive/payload.js";
import { normalizeOptionalString } from "../../shared/string-coerce.js";
import { copyReplyPayloadMetadata } from "../reply-payload.js";
import type { OriginatingChannelType } from "../templating.js";
import type { ReplyPayload, ReplyThreadingPolicy } from "../types.js";
import { extractReplyToTag } from "./reply-tags.js";
import {
  createReplyToModeFilterForChannel,
  resolveImplicitCurrentMessageReplyAllowance,
} from "./reply-threading.js";

/** Reused helper for format Btw Text For External Delivery behavior in src/auto-reply/reply. */
export function formatBtwTextForExternalDelivery(payload: ReplyPayload): string | undefined {
  const text = normalizeOptionalString(payload.text);
  if (!text) {
    return payload.text;
  }
  const question = normalizeOptionalString(payload.btw?.question);
  if (!question) {
    return payload.text;
  }
  const formatted = `BTW\nQuestion: ${question}\n\n${text}`;
  return text === formatted || text.startsWith("BTW\nQuestion:") ? text : formatted;
}

function resolveReplyThreadingForPayload(params: {
  payload: ReplyPayload;
  replyToMode?: ReplyToMode;
  implicitReplyToId?: string;
  currentMessageId?: string;
  replyThreading?: ReplyThreadingPolicy;
}): ReplyPayload {
  const implicitReplyToId = normalizeOptionalString(params.implicitReplyToId);
  const currentMessageId = normalizeOptionalString(params.currentMessageId);
  const allowImplicitReplyToCurrentMessage = resolveImplicitCurrentMessageReplyAllowance(
    params.replyToMode,
    params.replyThreading,
  );

  let resolved: ReplyPayload =
    params.payload.replyToId ||
    params.payload.replyToCurrent === false ||
    !implicitReplyToId ||
    !allowImplicitReplyToCurrentMessage
      ? params.payload
      : copyReplyPayloadMetadata(params.payload, {
          ...params.payload,
          replyToId: implicitReplyToId,
        });

  if (typeof resolved.text === "string" && resolved.text.includes("[[")) {
    const { cleaned, replyToId, replyToCurrent, hasTag } = extractReplyToTag(
      resolved.text,
      currentMessageId,
    );
    resolved = copyReplyPayloadMetadata(resolved, {
      ...resolved,
      text: cleaned ? cleaned : undefined,
      replyToId: replyToId ?? resolved.replyToId,
      replyToTag: hasTag || resolved.replyToTag,
      replyToCurrent: replyToCurrent || resolved.replyToCurrent,
    });
  }

  if (resolved.replyToCurrent && !resolved.replyToId && currentMessageId) {
    resolved = copyReplyPayloadMetadata(resolved, {
      ...resolved,
      replyToId: currentMessageId,
    });
  }

  return resolved;
}

/** Reused helper for apply Reply Tags To Payload behavior in src/auto-reply/reply. */
export function applyReplyTagsToPayload(
  payload: ReplyPayload,
  currentMessageId?: string,
): ReplyPayload {
  return resolveReplyThreadingForPayload({ payload, currentMessageId });
}

/** Reused helper for is Renderable Payload behavior in src/auto-reply/reply. */
export function isRenderablePayload(payload: ReplyPayload): boolean {
  return hasReplyPayloadContent(payload, { extraContent: payload.audioAsVoice });
}

/** Reused helper for should Suppress Reasoning Payload behavior in src/auto-reply/reply. */
export function shouldSuppressReasoningPayload(payload: ReplyPayload): boolean {
  return payload.isReasoning === true;
}

/** Reused helper for apply Reply Threading behavior in src/auto-reply/reply. */
export function applyReplyThreading(params: {
  payloads: ReplyPayload[];
  replyToMode: ReplyToMode;
  replyToChannel?: OriginatingChannelType;
  currentMessageId?: string;
  replyThreading?: ReplyThreadingPolicy;
}): ReplyPayload[] {
  const { payloads, replyToMode, replyToChannel, currentMessageId, replyThreading } = params;
  const applyReplyToMode = createReplyToModeFilterForChannel(replyToMode, replyToChannel);
  const implicitReplyToId = normalizeOptionalString(currentMessageId);
  return payloads
    .map((payload) =>
      resolveReplyThreadingForPayload({
        payload,
        replyToMode,
        implicitReplyToId,
        currentMessageId,
        replyThreading,
      }),
    )
    .filter(isRenderablePayload)
    .map(applyReplyToMode);
}
