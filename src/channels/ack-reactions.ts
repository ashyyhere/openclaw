// Acknowledgement reaction policy and cleanup helpers.
/** Configured scope for when inbound messages receive an acknowledgement reaction. */
export type AckReactionScope = "all" | "direct" | "group-all" | "group-mentions" | "off" | "none";

/** WhatsApp-specific ack reaction setting kept for plugin compatibility. */
export type WhatsAppAckReactionMode = "always" | "mentions" | "never";

/** In-flight ack reaction plus cleanup callback. */
export type AckReactionHandle = {
  ackReactionPromise: Promise<boolean>;
  ackReactionValue: string;
  remove: () => Promise<void>;
};

/** Facts used to decide whether an inbound turn gets an ack reaction. */
export type AckReactionGateParams = {
  scope: AckReactionScope | undefined;
  isDirect: boolean;
  isGroup: boolean;
  isMentionableGroup: boolean;
  requireMention: boolean;
  canDetectMention: boolean;
  effectiveWasMentioned: boolean;
  shouldBypassMention?: boolean;
};

/** Return true when an inbound turn should receive an ack reaction. */
export function shouldAckReaction(params: AckReactionGateParams): boolean {
  const scope = params.scope ?? "group-mentions";
  if (scope === "off" || scope === "none") {
    return false;
  }
  if (scope === "all") {
    return true;
  }
  if (scope === "direct") {
    return params.isDirect;
  }
  if (scope === "group-all") {
    return params.isGroup;
  }
  if (scope === "group-mentions") {
    if (!params.isMentionableGroup) {
      return false;
    }
    if (!params.requireMention) {
      return false;
    }
    if (!params.canDetectMention) {
      return false;
    }
    return params.effectiveWasMentioned || params.shouldBypassMention === true;
  }
  return false;
}

/** Resolve WhatsApp's legacy ack reaction mode into the generic ack policy. */
export function shouldAckReactionForWhatsApp(params: {
  emoji: string;
  isDirect: boolean;
  isGroup: boolean;
  directEnabled: boolean;
  groupMode: WhatsAppAckReactionMode;
  wasMentioned: boolean;
  groupActivated: boolean;
}): boolean {
  if (!params.emoji) {
    return false;
  }
  if (params.isDirect) {
    return params.directEnabled;
  }
  if (!params.isGroup) {
    return false;
  }
  if (params.groupMode === "never") {
    return false;
  }
  if (params.groupMode === "always") {
    return true;
  }
  return shouldAckReaction({
    scope: "group-mentions",
    isDirect: false,
    isGroup: true,
    isMentionableGroup: true,
    requireMention: true,
    canDetectMention: true,
    effectiveWasMentioned: params.wasMentioned,
    shouldBypassMention: params.groupActivated,
  });
}

/** Create an ack reaction handle from a reaction promise and cleanup callback. */
export function createAckReactionHandle(params: {
  ackReactionValue: string;
  send: () => Promise<void>;
  remove: () => Promise<void>;
  onSendError?: (err: unknown) => void;
}): AckReactionHandle | null {
  const ackReactionValue = params.ackReactionValue.trim();
  if (!ackReactionValue) {
    return null;
  }

  let sendPromise: Promise<void>;
  try {
    sendPromise = params.send();
  } catch (err) {
    sendPromise = Promise.reject(err);
  }

  return {
    ackReactionPromise: sendPromise.then(
      () => true,
      (err) => {
        params.onSendError?.(err);
        return false;
      },
    ),
    ackReactionValue,
    remove: params.remove,
  };
}

/** Remove an ack reaction after reply delivery when the original ack was sent. */
export function removeAckReactionAfterReply(params: {
  removeAfterReply: boolean;
  ackReactionPromise: Promise<boolean> | null;
  ackReactionValue: string | null;
  remove: () => Promise<void>;
  onError?: (err: unknown) => void;
}) {
  if (!params.removeAfterReply) {
    return;
  }
  if (!params.ackReactionPromise) {
    return;
  }
  if (!params.ackReactionValue) {
    return;
  }
  void params.ackReactionPromise.then((didAck) => {
    if (!didAck) {
      return;
    }
    params.remove().catch((err) => params.onError?.(err));
  });
}

/** Remove an ack reaction through its handle, swallowing cleanup when no ack was sent. */
export function removeAckReactionHandleAfterReply(params: {
  removeAfterReply: boolean;
  ackReaction: AckReactionHandle | null | undefined;
  onError?: (err: unknown) => void;
}) {
  removeAckReactionAfterReply({
    removeAfterReply: params.removeAfterReply,
    ackReactionPromise: params.ackReaction?.ackReactionPromise ?? null,
    ackReactionValue: params.ackReaction?.ackReactionValue ?? null,
    remove: params.ackReaction?.remove ?? (async () => {}),
    onError: params.onError,
  });
}
