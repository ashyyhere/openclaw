// Shared types for plugins conversation binding types behavior.
import type { ReplyPayload } from "../auto-reply/reply-payload.js";

/** Shared type for Plugin Conversation Binding Request Params in src/plugins. */
export type PluginConversationBindingRequestParams = {
  summary?: string;
  detachHint?: string;
  data?: Record<string, unknown>;
};

/** Shared type for Plugin Conversation Binding Resolution Decision in src/plugins. */
export type PluginConversationBindingResolutionDecision = "allow-once" | "allow-always" | "deny";

/** Shared type for Plugin Conversation Binding in src/plugins. */
export type PluginConversationBinding = {
  bindingId: string;
  pluginId: string;
  pluginName?: string;
  pluginRoot: string;
  channel: string;
  accountId: string;
  conversationId: string;
  parentConversationId?: string;
  threadId?: string | number;
  boundAt: number;
  summary?: string;
  detachHint?: string;
  data?: Record<string, unknown>;
};

/** Shared type for Plugin Conversation Binding Request Result in src/plugins. */
export type PluginConversationBindingRequestResult =
  | {
      status: "bound";
      binding: PluginConversationBinding;
    }
  | {
      status: "pending";
      approvalId: string;
      reply: ReplyPayload;
    }
  | {
      status: "error";
      message: string;
    };

/** Shared type for Plugin Conversation Binding Resolved Event in src/plugins. */
export type PluginConversationBindingResolvedEvent = {
  status: "approved" | "denied";
  binding?: PluginConversationBinding;
  decision: PluginConversationBindingResolutionDecision;
  request: {
    summary?: string;
    detachHint?: string;
    data?: Record<string, unknown>;
    requestedBySenderId?: string;
    conversation: {
      channel: string;
      accountId: string;
      conversationId: string;
      parentConversationId?: string;
      threadId?: string | number;
    };
  };
};
