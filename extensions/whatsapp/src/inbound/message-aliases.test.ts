import { describe, expect, it } from "vitest";
import {
  normalizeWebInboundMessage,
  withDeprecatedWebInboundMessageFlatAliases,
} from "./message-aliases.js";
import type { WhatsAppSendResult } from "./send-result.js";
import type {
  LegacyFlatWebInboundMessage,
  WebInboundCallbackMessage,
  WebInboundMessageInput,
  WebInboundMessageWithDeprecatedAliases,
} from "./types.js";

const sendResult: WhatsAppSendResult = {
  kind: "text",
  messageId: "sent",
  keys: [],
  providerAccepted: true,
};

const sendComposing = async () => {};
const reply = async () => sendResult;
const sendMedia = async () => sendResult;

const canonicalMessage: WebInboundCallbackMessage = {
  event: {
    id: "event-id",
    timestamp: 1_700_000_000,
    isBatched: true,
  },
  payload: {
    body: "nested body",
    media: {
      path: "/tmp/image.jpg",
      type: "image/jpeg",
      fileName: "image.jpg",
      url: "https://example.test/image.jpg",
    },
    location: {
      latitude: 1.23,
      longitude: 4.56,
      name: "HQ",
    },
    untrustedStructuredContext: [
      {
        label: "WhatsApp contact",
        source: "whatsapp",
        type: "contact",
        payload: { name: "Ada" },
      },
    ],
  },
  quote: {
    context: {
      id: "quoted-id",
      body: "quoted body",
      sender: {
        label: "Quoted Sender",
        jid: "quoted@s.whatsapp.net",
        e164: "+15550001111",
      },
    },
    id: "quoted-id",
    body: "quoted body",
    sender: {
      displayName: "Fallback Sender",
      jid: "fallback@s.whatsapp.net",
      e164: "+15550002222",
    },
  },
  group: {
    subject: "Group subject",
    participants: ["111@s.whatsapp.net", "222@s.whatsapp.net"],
    mentions: {
      jids: ["333@s.whatsapp.net"],
    },
  },
  platform: {
    chatJid: "123@g.us",
    recipientJid: "+15550000000",
    sender: {
      jid: "sender@s.whatsapp.net",
      e164: "+15550003333",
      label: "Sender",
    },
    senderJid: "sender@s.whatsapp.net",
    senderE164: "+15550003333",
    senderName: "Sender Name",
    pushName: "Push Name",
    self: {
      jid: "self@s.whatsapp.net",
      lid: "self@lid",
      e164: "+15550004444",
    },
    selfJid: "self@s.whatsapp.net",
    selfLid: "self@lid",
    selfE164: "+15550004444",
    fromMe: false,
    sendComposing,
    reply,
    sendMedia,
  },
  from: "123@g.us",
  conversationId: "123@g.us",
  accountId: "default",
  accessControlPassed: true,
  chatType: "group",
  wasMentioned: true,
};

function legacyMessage(): LegacyFlatWebInboundMessage {
  return {
    id: "event-id",
    timestamp: 1_700_000_000,
    isBatched: true,
    to: "+15550000000",
    body: "flat body",
    pushName: "Push Name",
    chatId: "123@g.us",
    sender: {
      jid: "sender@s.whatsapp.net",
      e164: "+15550003333",
      label: "Sender",
    },
    senderJid: "sender@s.whatsapp.net",
    senderE164: "+15550003333",
    senderName: "Sender Name",
    replyTo: {
      id: "quoted-id",
      body: "quoted body",
      sender: {
        label: "Quoted Sender",
        jid: "quoted@s.whatsapp.net",
        e164: "+15550001111",
      },
    },
    replyToId: "ignored-by-replyTo-context",
    replyToBody: "ignored by replyTo context",
    replyToSender: "ignored by replyTo context",
    replyToSenderJid: "ignored@s.whatsapp.net",
    replyToSenderE164: "+15550009999",
    groupSubject: "Group subject",
    groupParticipants: ["111@s.whatsapp.net", "222@s.whatsapp.net"],
    mentions: ["333@s.whatsapp.net"],
    mentionedJids: ["444@s.whatsapp.net"],
    self: {
      jid: "self@s.whatsapp.net",
      lid: "self@lid",
      e164: "+15550004444",
    },
    selfJid: "self@s.whatsapp.net",
    selfLid: "self@lid",
    selfE164: "+15550004444",
    fromMe: false,
    location: {
      latitude: 1.23,
      longitude: 4.56,
      name: "HQ",
    },
    sendComposing,
    reply,
    sendMedia,
    mediaPath: "/tmp/image.jpg",
    mediaType: "image/jpeg",
    mediaFileName: "image.jpg",
    mediaUrl: "https://example.test/image.jpg",
    untrustedStructuredContext: [
      {
        label: "WhatsApp contact",
        source: "whatsapp",
        type: "contact",
        payload: { name: "Ada" },
      },
    ],
    from: "123@g.us",
    conversationId: "123@g.us",
    accountId: "default",
    accessControlPassed: true,
    chatType: "group",
    wasMentioned: true,
  };
}

describe("normalizeWebInboundMessage", () => {
  it("attaches every deprecated flat alias from canonical nested contexts", () => {
    const msg = withDeprecatedWebInboundMessageFlatAliases({ ...canonicalMessage });

    const aliases: Array<[keyof WebInboundMessageWithDeprecatedAliases, unknown]> = [
      ["id", "event-id"],
      ["timestamp", 1_700_000_000],
      ["isBatched", true],
      ["to", "+15550000000"],
      ["body", "nested body"],
      ["pushName", "Push Name"],
      ["chatId", "123@g.us"],
      ["sender", canonicalMessage.platform.sender],
      ["senderJid", "sender@s.whatsapp.net"],
      ["senderE164", "+15550003333"],
      ["senderName", "Sender Name"],
      ["replyTo", canonicalMessage.quote?.context],
      ["replyToId", "quoted-id"],
      ["replyToBody", "quoted body"],
      ["replyToSender", "Quoted Sender"],
      ["replyToSenderJid", "quoted@s.whatsapp.net"],
      ["replyToSenderE164", "+15550001111"],
      ["groupSubject", "Group subject"],
      ["groupParticipants", ["111@s.whatsapp.net", "222@s.whatsapp.net"]],
      ["mentions", ["333@s.whatsapp.net"]],
      ["mentionedJids", ["333@s.whatsapp.net"]],
      ["self", canonicalMessage.platform.self],
      ["selfJid", "self@s.whatsapp.net"],
      ["selfLid", "self@lid"],
      ["selfE164", "+15550004444"],
      ["fromMe", false],
      ["location", canonicalMessage.payload.location],
      ["sendComposing", sendComposing],
      ["reply", reply],
      ["sendMedia", sendMedia],
      ["mediaPath", "/tmp/image.jpg"],
      ["mediaType", "image/jpeg"],
      ["mediaFileName", "image.jpg"],
      ["mediaUrl", "https://example.test/image.jpg"],
      ["untrustedStructuredContext", canonicalMessage.payload.untrustedStructuredContext],
    ];

    for (const [key, expected] of aliases) {
      expect(msg[key], key).toEqual(expected);
    }
  });

  it("normalizes every legacy flat alias into nested contexts", () => {
    const normalized = normalizeWebInboundMessage(legacyMessage());

    expect(normalized.event).toEqual({
      id: "event-id",
      timestamp: 1_700_000_000,
      isBatched: true,
    });
    expect(normalized.payload).toEqual({
      body: "flat body",
      media: {
        path: "/tmp/image.jpg",
        type: "image/jpeg",
        fileName: "image.jpg",
        url: "https://example.test/image.jpg",
      },
      location: {
        latitude: 1.23,
        longitude: 4.56,
        name: "HQ",
      },
      untrustedStructuredContext: [
        {
          label: "WhatsApp contact",
          source: "whatsapp",
          type: "contact",
          payload: { name: "Ada" },
        },
      ],
    });
    expect(normalized.platform.chatJid).toBe("123@g.us");
    expect(normalized.platform.recipientJid).toBe("+15550000000");
    expect(normalized.platform.senderJid).toBe("sender@s.whatsapp.net");
    expect(normalized.platform.senderE164).toBe("+15550003333");
    expect(normalized.platform.senderName).toBe("Sender Name");
    expect(normalized.platform.pushName).toBe("Push Name");
    expect(normalized.platform.selfJid).toBe("self@s.whatsapp.net");
    expect(normalized.platform.selfLid).toBe("self@lid");
    expect(normalized.platform.selfE164).toBe("+15550004444");
    expect(normalized.platform.fromMe).toBe(false);
    expect(normalized.platform.sendComposing).toBe(sendComposing);
    expect(normalized.platform.reply).toBe(reply);
    expect(normalized.platform.sendMedia).toBe(sendMedia);
    expect(normalized.quote).toEqual({
      context: {
        id: "quoted-id",
        body: "quoted body",
        sender: {
          label: "Quoted Sender",
          jid: "quoted@s.whatsapp.net",
          e164: "+15550001111",
        },
      },
      id: "quoted-id",
      body: "quoted body",
      sender: {
        displayName: "Quoted Sender",
        jid: "quoted@s.whatsapp.net",
        e164: "+15550001111",
      },
    });
    expect(normalized.group).toEqual({
      subject: "Group subject",
      participants: ["111@s.whatsapp.net", "222@s.whatsapp.net"],
      mentions: { jids: ["333@s.whatsapp.net"] },
    });
    expect(normalized.body).toBe("flat body");
    expect(normalized.mediaFileName).toBe("image.jpg");
    expect(normalized.mediaUrl).toBe("https://example.test/image.jpg");
    expect(normalized.replyToSender).toBe("Quoted Sender");
    expect(normalized.mentionedJids).toEqual(["333@s.whatsapp.net"]);
  });

  it("treats complete nested input as authoritative over conflicting deprecated aliases", () => {
    const conflicting = {
      ...withDeprecatedWebInboundMessageFlatAliases({ ...canonicalMessage }),
      body: "flat body",
      chatId: "flat-chat",
      mediaPath: "/tmp/flat.jpg",
      replyToSender: "Flat Sender",
      mentionedJids: ["flat@s.whatsapp.net"],
    } satisfies WebInboundMessageWithDeprecatedAliases;

    const normalized = normalizeWebInboundMessage(conflicting);

    expect(normalized.payload.body).toBe("nested body");
    expect(normalized.platform.chatJid).toBe("123@g.us");
    expect(normalized.payload.media?.path).toBe("/tmp/image.jpg");
    expect(normalized.replyToSender).toBe("Quoted Sender");
    expect(normalized.mentionedJids).toEqual(["333@s.whatsapp.net"]);
  });

  it("backfills missing optional nested facts from deprecated aliases", () => {
    const mixed = {
      ...withDeprecatedWebInboundMessageFlatAliases({ ...canonicalMessage }),
      event: {},
      payload: {
        body: "nested body",
      },
      platform: {
        chatJid: "123@g.us",
        recipientJid: "+15550000000",
        sendComposing,
        reply,
        sendMedia,
      },
      quote: undefined,
      group: undefined,
      id: "flat-event-id",
      timestamp: 1_700_000_123,
      isBatched: true,
      mediaPath: "/tmp/flat.jpg",
      mediaType: "image/jpeg",
      mediaFileName: "flat.jpg",
      mediaUrl: "https://example.test/flat.jpg",
      replyTo: undefined,
      replyToId: "flat-quote-id",
      replyToBody: "flat quote",
      replyToSender: "Flat Quote Sender",
      replyToSenderJid: "flat-quote@s.whatsapp.net",
      replyToSenderE164: "+15550008888",
      groupSubject: "Flat group",
      groupParticipants: ["flat-participant@s.whatsapp.net"],
      mentions: undefined,
      mentionedJids: ["flat-mention@s.whatsapp.net"],
      senderName: "Flat Sender",
      selfJid: "flat-self@s.whatsapp.net",
    } satisfies WebInboundMessageWithDeprecatedAliases;

    const normalized = normalizeWebInboundMessage(mixed);

    expect(normalized.event).toEqual({
      id: "flat-event-id",
      timestamp: 1_700_000_123,
      isBatched: true,
    });
    expect(normalized.payload.media).toEqual({
      path: "/tmp/flat.jpg",
      type: "image/jpeg",
      fileName: "flat.jpg",
      url: "https://example.test/flat.jpg",
    });
    expect(normalized.platform.senderName).toBe("Flat Sender");
    expect(normalized.platform.selfJid).toBe("flat-self@s.whatsapp.net");
    expect(normalized.quote).toEqual({
      id: "flat-quote-id",
      body: "flat quote",
      sender: {
        displayName: "Flat Quote Sender",
        jid: "flat-quote@s.whatsapp.net",
        e164: "+15550008888",
      },
    });
    expect(normalized.group).toEqual({
      subject: "Flat group",
      participants: ["flat-participant@s.whatsapp.net"],
      mentions: { jids: ["flat-mention@s.whatsapp.net"] },
    });
  });

  it("rejects partial nested legacy hybrids", () => {
    const partialHybrid = {
      ...legacyMessage(),
      payload: { body: "nested-only" },
    } as unknown as WebInboundMessageInput;

    expect(() => normalizeWebInboundMessage(partialHybrid)).toThrow(
      /legacy flat or canonical nested/,
    );
  });

  it("accepts legacy flat messages with optional quote and group contexts", () => {
    const legacy = {
      ...legacyMessage(),
      replyTo: undefined,
      replyToId: "flat-quote-id",
      replyToBody: undefined,
      replyToSender: "Flat Quote Sender",
      replyToSenderJid: "flat-quote@s.whatsapp.net",
      replyToSenderE164: "+15550008888",
      groupSubject: undefined,
      groupParticipants: ["flat-participant@s.whatsapp.net"],
      mentions: undefined,
      mentionedJids: undefined,
      quote: {
        body: "nested quote",
      },
      group: {
        mentions: { jids: ["nested@s.whatsapp.net"] },
      },
    } satisfies LegacyFlatWebInboundMessage;

    const normalized = normalizeWebInboundMessage(legacy);

    expect(normalized.quote).toEqual({
      body: "nested quote",
      id: "flat-quote-id",
      sender: {
        displayName: "Flat Quote Sender",
        jid: "flat-quote@s.whatsapp.net",
        e164: "+15550008888",
      },
    });
    expect(normalized.group).toEqual({
      participants: ["flat-participant@s.whatsapp.net"],
      mentions: { jids: ["nested@s.whatsapp.net"] },
    });
    expect(normalized.replyToBody).toBe("nested quote");
    expect(normalized.replyToId).toBe("flat-quote-id");
    expect(normalized.replyToSender).toBe("Flat Quote Sender");
    expect(normalized.mentionedJids).toEqual(["nested@s.whatsapp.net"]);
  });

  it("keeps media and group mentions absent when legacy facts are absent", () => {
    const legacy = {
      ...legacyMessage(),
      mediaPath: undefined,
      mediaType: undefined,
      mediaFileName: undefined,
      mediaUrl: undefined,
      mentions: undefined,
      mentionedJids: undefined,
    };

    const normalized = normalizeWebInboundMessage(legacy);

    expect(normalized.payload.media).toBeUndefined();
    expect(normalized.group?.mentions).toBeUndefined();
  });

  it("keeps media and group absent when canonical nested facts are empty", () => {
    const normalized = normalizeWebInboundMessage({
      ...canonicalMessage,
      payload: {
        body: "text only",
        media: {},
      },
      group: {
        mentions: {
          jids: undefined,
        },
      },
    });

    expect(normalized.payload.media).toBeUndefined();
    expect(normalized.group).toBeUndefined();
    expect(normalized.mediaPath).toBeUndefined();
    expect(normalized.mentionedJids).toBeUndefined();
  });
});
