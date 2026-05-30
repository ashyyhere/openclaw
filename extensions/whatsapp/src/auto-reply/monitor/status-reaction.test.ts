import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { withDeprecatedWebInboundMessageFlatAliases } from "../../inbound/message-aliases.js";
import type { WhatsAppSendResult } from "../../inbound/send-result.js";
import type { WebInboundMessageWithDeprecatedAliases } from "../../inbound/types.js";
import { createWhatsAppStatusReactionController } from "./status-reaction.js";

const hoisted = vi.hoisted(() => ({
  sendReactionWhatsApp: vi.fn(async () => undefined),
}));

vi.mock("../../send.js", () => ({
  sendReactionWhatsApp: hoisted.sendReactionWhatsApp,
}));

function acceptedSendResult(kind: "media" | "text", id: string): WhatsAppSendResult {
  return {
    kind,
    messageId: id,
    keys: [{ id }],
    providerAccepted: true,
  };
}

function createMessage(
  overrides: Partial<WebInboundMessageWithDeprecatedAliases> = {},
): WebInboundMessageWithDeprecatedAliases {
  return withDeprecatedWebInboundMessageFlatAliases({
    event: {
      id: "msg-1",
    },
    payload: {
      body: "hello",
    },
    platform: {
      chatJid: "15551234567@s.whatsapp.net",
      recipientJid: "15559876543",
      sendComposing: async () => {},
      reply: async () => acceptedSendResult("text", "r1"),
      sendMedia: async () => acceptedSendResult("media", "m1"),
    },
    from: "15551234567",
    conversationId: "15551234567",
    accountId: "default",
    chatType: "direct",
    ...overrides,
  });
}

describe("createWhatsAppStatusReactionController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses the agent identity emoji when WhatsApp ackReaction has no emoji", async () => {
    const cfg = {
      agents: {
        list: [{ id: "agent", identity: { emoji: "🔥" } }],
      },
      messages: {
        statusReactions: {
          enabled: true,
          timing: {
            debounceMs: 1_000_000,
            stallSoftMs: 1_000_000,
            stallHardMs: 1_000_000,
            doneHoldMs: 0,
            errorHoldMs: 0,
          },
        },
      },
      channels: {
        whatsapp: {
          reactionLevel: "ack",
          ackReaction: {
            direct: true,
            group: "mentions",
          },
        },
      },
    } as OpenClawConfig;

    const controller = await createWhatsAppStatusReactionController({
      cfg,
      msg: createMessage(),
      agentId: "agent",
      sessionKey: "whatsapp:default:15551234567",
      conversationId: "15551234567",
      verbose: false,
      accountId: "default",
    });

    void controller?.setQueued();
    await vi.waitFor(() => {
      expect(hoisted.sendReactionWhatsApp).toHaveBeenCalledWith(
        "15551234567@s.whatsapp.net",
        "msg-1",
        "🔥",
        {
          verbose: false,
          fromMe: false,
          accountId: "default",
          cfg,
        },
      );
    });
    await controller?.clear();
  });
});
