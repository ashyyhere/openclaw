// Shared test-only shapes for validating interactive channel handler contracts.
type ConversationBindingHelpers = {
  requestConversationBinding: (...args: unknown[]) => unknown;
  detachConversationBinding: (...args: unknown[]) => unknown;
  getCurrentConversationBinding: (...args: unknown[]) => unknown;
};

type InteractiveHandlerRegistration<
  TChannel extends string,
  TContext,
> = ConversationBindingHelpers & {
  channel: TChannel;
  namespace: string;
  handler: (ctx: TContext) => unknown;
};

type BaseInteractiveContext<TChannel extends string> = ConversationBindingHelpers & {
  channel: TChannel;
  accountId: string;
  conversationId: string;
  parentConversationId?: string;
  senderId: string;
  senderUsername?: string;
  auth?: unknown;
};

/** Telegram callback context shape expected by interactive contract tests. */
export type TelegramInteractiveHandlerContext = BaseInteractiveContext<"telegram"> & {
  callbackId: string;
  senderUsername?: string;
  threadId?: number;
  isGroup?: boolean;
  isForum?: boolean;
  callback: {
    data: string;
    namespace: string;
    payload: string;
    messageId: number;
    chatId: string;
    messageText?: string;
  };
  respond: Record<string, (...args: unknown[]) => unknown>;
};

/** Discord interaction context shape expected by interactive contract tests. */
export type DiscordInteractiveHandlerContext = BaseInteractiveContext<"discord"> & {
  interactionId: string;
  guildId?: string;
  interaction: {
    data: string;
    namespace: string;
    payload: string;
    [key: string]: unknown;
  };
  respond: Record<string, (...args: unknown[]) => unknown>;
};

/** Slack interaction context shape expected by interactive contract tests. */
export type SlackInteractiveHandlerContext = BaseInteractiveContext<"slack"> & {
  interactionId: string;
  threadId?: string;
  interaction: {
    data: string;
    namespace: string;
    payload: string;
    [key: string]: unknown;
  };
  respond: Record<string, (...args: unknown[]) => unknown>;
};

/** Registration tuple used by tests for Telegram interactive handlers. */
export type TelegramInteractiveHandlerRegistration = InteractiveHandlerRegistration<
  "telegram",
  TelegramInteractiveHandlerContext
>;
/** Registration tuple used by tests for Discord interactive handlers. */
export type DiscordInteractiveHandlerRegistration = InteractiveHandlerRegistration<
  "discord",
  DiscordInteractiveHandlerContext
>;
/** Registration tuple used by tests for Slack interactive handlers. */
export type SlackInteractiveHandlerRegistration = InteractiveHandlerRegistration<
  "slack",
  SlackInteractiveHandlerContext
>;
