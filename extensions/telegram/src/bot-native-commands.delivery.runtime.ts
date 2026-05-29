// Runtime boundary for extensions/telegram/src bot native commands delivery runtime behavior.
import { createChannelMessageReplyPipeline } from "openclaw/plugin-sdk/channel-outbound";
import { deliverReplies, emitTelegramMessageSentHooks } from "./bot/delivery.js";

export { createChannelMessageReplyPipeline, deliverReplies, emitTelegramMessageSentHooks };
