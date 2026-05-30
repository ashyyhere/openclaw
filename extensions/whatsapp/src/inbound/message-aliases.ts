import type {
  DeprecatedWebInboundMessageFlatAliases,
  LegacyFlatWebInboundMessage,
  WebInboundCallbackMessage,
  WebInboundMessageInput,
  WebInboundMessageWithDeprecatedAliases,
  WhatsAppInboundEvent,
  WhatsAppInboundGroupContext,
  WhatsAppInboundPayload,
  WhatsAppInboundPlatform,
  WhatsAppInboundQuote,
} from "./types.js";

export type CanonicalWebInboundMessageFields = {
  event: WhatsAppInboundEvent;
  payload: WhatsAppInboundPayload;
  platform: WhatsAppInboundPlatform;
  from: string;
  conversationId: string;
  accountId: string;
  accessControlPassed?: boolean;
  chatType: "direct" | "group";
  quote?: WhatsAppInboundQuote;
  group?: WhatsAppInboundGroupContext;
  wasMentioned?: boolean;
};

type DeprecatedFlatAliasInput = Partial<DeprecatedWebInboundMessageFlatAliases>;

function hasMediaFacts(msg: DeprecatedFlatAliasInput): boolean {
  return Boolean(msg.mediaPath || msg.mediaType || msg.mediaFileName || msg.mediaUrl);
}

function buildMediaFromFlatAliases(
  msg: DeprecatedFlatAliasInput,
): WhatsAppInboundPayload["media"] | undefined {
  return normalizePayloadMedia(
    hasMediaFacts(msg)
      ? {
          path: msg.mediaPath,
          type: msg.mediaType,
          fileName: msg.mediaFileName,
          url: msg.mediaUrl,
        }
      : undefined,
  );
}

function normalizePayloadMedia(
  media: WhatsAppInboundPayload["media"] | undefined,
): WhatsAppInboundPayload["media"] | undefined {
  if (!media?.path && !media?.type && !media?.fileName && !media?.url) {
    return undefined;
  }
  return media;
}

function normalizePayload(
  payload: WhatsAppInboundPayload,
  flat?: DeprecatedFlatAliasInput,
): WhatsAppInboundPayload {
  return {
    ...payload,
    media: normalizePayloadMedia(payload.media) ?? buildMediaFromFlatAliases(flat ?? {}),
    location: payload.location ?? flat?.location,
    untrustedStructuredContext:
      payload.untrustedStructuredContext ?? flat?.untrustedStructuredContext,
  };
}

function buildPayloadFromFlatAliases(msg: LegacyFlatWebInboundMessage): WhatsAppInboundPayload {
  return {
    body: msg.body,
    media: buildMediaFromFlatAliases(msg),
    location: msg.location,
    untrustedStructuredContext: msg.untrustedStructuredContext,
  };
}

function buildQuoteFromFlatAliases(
  msg: DeprecatedFlatAliasInput,
): WhatsAppInboundQuote | undefined {
  if (msg.replyTo) {
    return {
      context: msg.replyTo,
      id: msg.replyTo.id,
      body: msg.replyTo.body,
      sender: {
        displayName: msg.replyTo.sender?.label ?? undefined,
        jid: msg.replyTo.sender?.jid ?? undefined,
        e164: msg.replyTo.sender?.e164 ?? undefined,
      },
    };
  }
  if (!msg.replyToId && !msg.replyToBody && !msg.replyToSender) {
    return undefined;
  }
  return {
    id: msg.replyToId,
    body: msg.replyToBody,
    sender: {
      displayName: msg.replyToSender,
      jid: msg.replyToSenderJid,
      e164: msg.replyToSenderE164,
    },
  };
}

function normalizeQuote(
  quote: WhatsAppInboundQuote | undefined,
  flat: WhatsAppInboundQuote | undefined,
): WhatsAppInboundQuote | undefined {
  if (!quote) {
    return flat;
  }
  return {
    context: quote.context ?? flat?.context,
    id: quote.id ?? flat?.id,
    body: quote.body ?? flat?.body,
    sender:
      quote.sender || flat?.sender
        ? {
            displayName: quote.sender?.displayName ?? flat?.sender?.displayName,
            jid: quote.sender?.jid ?? flat?.sender?.jid,
            e164: quote.sender?.e164 ?? flat?.sender?.e164,
          }
        : undefined,
  };
}

function buildGroupFromFlatAliases(
  msg: DeprecatedFlatAliasInput,
): WhatsAppInboundGroupContext | undefined {
  const mentionJids = msg.mentions ?? msg.mentionedJids;
  return normalizeGroup({
    subject: msg.groupSubject,
    participants: msg.groupParticipants,
    mentions: mentionJids?.length ? { jids: mentionJids } : undefined,
  });
}

function normalizeGroupMentions(
  mentions: WhatsAppInboundGroupContext["mentions"] | undefined,
): WhatsAppInboundGroupContext["mentions"] | undefined {
  const text = mentions?.text?.length ? mentions.text : undefined;
  const jids = mentions?.jids?.length ? mentions.jids : undefined;
  if (!text && !jids) {
    return undefined;
  }
  return { text, jids };
}

function normalizeGroup(
  group: WhatsAppInboundGroupContext | undefined,
  flat?: WhatsAppInboundGroupContext | undefined,
): WhatsAppInboundGroupContext | undefined {
  const subject = group?.subject ?? flat?.subject;
  const participants = group?.participants ?? flat?.participants;
  const mentions = normalizeGroupMentions({
    text: group?.mentions?.text ?? flat?.mentions?.text,
    jids: group?.mentions?.jids ?? flat?.mentions?.jids,
  });
  if (!subject && !participants?.length && !mentions) {
    return undefined;
  }
  return {
    subject,
    participants,
    mentions,
  };
}

function buildPlatformFromFlatAliases(msg: LegacyFlatWebInboundMessage): WhatsAppInboundPlatform {
  return {
    chatJid: msg.chatId,
    recipientJid: msg.to,
    sender: msg.sender,
    senderJid: msg.senderJid,
    senderE164: msg.senderE164,
    senderName: msg.senderName,
    pushName: msg.pushName,
    self: msg.self,
    selfJid: msg.selfJid,
    selfLid: msg.selfLid,
    selfE164: msg.selfE164,
    fromMe: msg.fromMe,
    sendComposing: msg.sendComposing,
    reply: msg.reply,
    sendMedia: msg.sendMedia,
  };
}

function buildEventFromFlatAliases(msg: LegacyFlatWebInboundMessage): WhatsAppInboundEvent {
  return {
    id: msg.id,
    timestamp: msg.timestamp,
    isBatched: msg.isBatched,
  };
}

function normalizeEvent(
  event: WhatsAppInboundEvent,
  flat: DeprecatedFlatAliasInput,
): WhatsAppInboundEvent {
  return {
    id: event.id ?? flat.id,
    timestamp: event.timestamp ?? flat.timestamp,
    isBatched: event.isBatched ?? flat.isBatched,
  };
}

function normalizePlatform(
  platform: WhatsAppInboundPlatform,
  flat: DeprecatedFlatAliasInput,
): WhatsAppInboundPlatform {
  return {
    ...platform,
    sender: platform.sender ?? flat.sender,
    senderJid: platform.senderJid ?? flat.senderJid,
    senderE164: platform.senderE164 ?? flat.senderE164,
    senderName: platform.senderName ?? flat.senderName,
    pushName: platform.pushName ?? flat.pushName,
    self: platform.self ?? flat.self,
    selfJid: platform.selfJid ?? flat.selfJid,
    selfLid: platform.selfLid ?? flat.selfLid,
    selfE164: platform.selfE164 ?? flat.selfE164,
    fromMe: platform.fromMe ?? flat.fromMe,
  };
}

function hasCompleteNestedContexts(msg: WebInboundMessageInput): msg is WebInboundCallbackMessage {
  return Boolean(msg.event && msg.payload && msg.platform);
}

function hasAnyCoreNestedContext(msg: WebInboundMessageInput): boolean {
  return Boolean(msg.event || msg.payload || msg.platform);
}

export function withDeprecatedWebInboundMessageFlatAliases<
  T extends CanonicalWebInboundMessageFields,
>(msg: T): T & WebInboundMessageWithDeprecatedAliases {
  // Keep the shipped callback shape alive while nested contexts remain canonical.
  return {
    ...msg,
    id: msg.event.id,
    to: msg.platform.recipientJid,
    body: msg.payload.body,
    pushName: msg.platform.pushName,
    timestamp: msg.event.timestamp,
    chatId: msg.platform.chatJid,
    sender: msg.platform.sender,
    senderJid: msg.platform.senderJid,
    senderE164: msg.platform.senderE164,
    senderName: msg.platform.senderName,
    replyTo: msg.quote?.context,
    replyToId: msg.quote?.id,
    replyToBody: msg.quote?.body,
    replyToSender: msg.quote?.context?.sender?.label ?? msg.quote?.sender?.displayName,
    replyToSenderJid: msg.quote?.context?.sender?.jid ?? msg.quote?.sender?.jid,
    replyToSenderE164: msg.quote?.context?.sender?.e164 ?? msg.quote?.sender?.e164,
    groupSubject: msg.group?.subject,
    groupParticipants: msg.group?.participants,
    mentions: msg.group?.mentions?.jids,
    mentionedJids: msg.group?.mentions?.jids,
    self: msg.platform.self,
    selfJid: msg.platform.selfJid,
    selfLid: msg.platform.selfLid,
    selfE164: msg.platform.selfE164,
    fromMe: msg.platform.fromMe,
    location: msg.payload.location,
    sendComposing: msg.platform.sendComposing,
    reply: msg.platform.reply,
    sendMedia: msg.platform.sendMedia,
    mediaPath: msg.payload.media?.path,
    mediaType: msg.payload.media?.type,
    mediaFileName: msg.payload.media?.fileName,
    mediaUrl: msg.payload.media?.url,
    untrustedStructuredContext: msg.payload.untrustedStructuredContext,
    isBatched: msg.event.isBatched,
  };
}

function normalizeLegacyFlatWebInboundMessage(
  msg: LegacyFlatWebInboundMessage,
): WebInboundMessageWithDeprecatedAliases {
  const flatQuote = buildQuoteFromFlatAliases(msg);
  const flatGroup = buildGroupFromFlatAliases(msg);
  return withDeprecatedWebInboundMessageFlatAliases({
    ...msg,
    event: buildEventFromFlatAliases(msg),
    payload: buildPayloadFromFlatAliases(msg),
    platform: buildPlatformFromFlatAliases(msg),
    quote: normalizeQuote(msg.quote, flatQuote),
    group: normalizeGroup(msg.group, flatGroup),
  });
}

export function normalizeWebInboundMessage(
  msg: WebInboundMessageInput,
): WebInboundMessageWithDeprecatedAliases {
  if (hasCompleteNestedContexts(msg)) {
    const flat = msg as WebInboundCallbackMessage & DeprecatedFlatAliasInput;
    const flatQuote = buildQuoteFromFlatAliases(flat);
    const flatGroup = buildGroupFromFlatAliases(flat);
    return withDeprecatedWebInboundMessageFlatAliases({
      ...msg,
      event: normalizeEvent(msg.event, flat),
      payload: normalizePayload(msg.payload, flat),
      platform: normalizePlatform(msg.platform, flat),
      quote: normalizeQuote(msg.quote, flatQuote),
      group: normalizeGroup(msg.group, flatGroup),
    });
  }

  if (hasAnyCoreNestedContext(msg)) {
    throw new Error(
      "WhatsApp inbound messages must be either legacy flat or canonical nested; partial nested contexts are not supported.",
    );
  }

  return normalizeLegacyFlatWebInboundMessage(msg);
}
