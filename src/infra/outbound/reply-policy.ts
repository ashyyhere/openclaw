// infra/outbound reply policy helpers and runtime behavior.
import { isSingleUseReplyToMode } from "../../auto-reply/reply/reply-reference.js";
import type { ReplyPayload } from "../../auto-reply/types.js";
import type { ReplyToMode } from "../../config/types.js";

/** Shared type for Reply To Override in src/infra/outbound. */
export type ReplyToOverride = {
  replyToId?: string | null | undefined;
  replyToIdSource?: ReplyToResolution["source"] | undefined;
};

/** Shared type for Reply To Resolution in src/infra/outbound. */
export type ReplyToResolution = {
  replyToId?: string;
  source?: "explicit" | "implicit";
};

/** Reused helper for create Reply To Fanout behavior in src/infra/outbound. */
export function createReplyToFanout(params: {
  replyToId?: string | null;
  replyToMode?: ReplyToMode;
  replyToIdSource?: ReplyToResolution["source"];
}): () => string | undefined {
  const replyToId = params.replyToId ?? undefined;
  if (!replyToId) {
    return () => undefined;
  }
  const singleUse =
    params.replyToIdSource !== "explicit" &&
    params.replyToMode !== undefined &&
    isSingleUseReplyToMode(params.replyToMode);
  if (!singleUse) {
    return () => replyToId;
  }
  let current: string | undefined = replyToId;
  return () => {
    const value = current;
    current = undefined;
    return value;
  };
}

/** Reused helper for create Reply To Delivery Policy behavior in src/infra/outbound. */
export function createReplyToDeliveryPolicy(params: {
  replyToId?: string | null;
  replyToMode?: ReplyToMode;
}): {
  resolveCurrentReplyTo: (payload: ReplyPayload) => ReplyToResolution;
  applyReplyToConsumption: <T extends ReplyToOverride>(
    overrides: T,
    options?: { consumeImplicitReply?: boolean },
  ) => T;
} {
  const singleUseReplyTo = params.replyToMode ? isSingleUseReplyToMode(params.replyToMode) : false;
  let replyToConsumed = false;

  const resolveCurrentReplyTo = (payload: ReplyPayload): ReplyToResolution => {
    if (payload.replyToId != null) {
      return payload.replyToId ? { replyToId: payload.replyToId, source: "explicit" } : {};
    }
    const replyToId = (params.replyToMode === "off" ? undefined : params.replyToId) ?? undefined;
    if (!replyToId) {
      return {};
    }
    if (!singleUseReplyTo) {
      return { replyToId, source: "implicit" };
    }
    return replyToConsumed ? {} : { replyToId, source: "implicit" };
  };

  const applyReplyToConsumption = <T extends ReplyToOverride>(
    overrides: T,
    options?: { consumeImplicitReply?: boolean },
  ): T => {
    if (!options?.consumeImplicitReply || !overrides.replyToId || !singleUseReplyTo) {
      return overrides;
    }
    if (replyToConsumed) {
      return { ...overrides, replyToId: undefined };
    }
    replyToConsumed = true;
    return overrides;
  };

  return { resolveCurrentReplyTo, applyReplyToConsumption };
}
