/**
 * Bundled-channel config schemas for OpenClaw-maintained plugins.
 *
 * Third-party plugins should define plugin-local schemas and import primitives
 * from openclaw/plugin-sdk/channel-config-schema instead of depending on these
 * bundled channel schemas.
 */
export {
  AllowFromListSchema,
  buildChannelConfigSchema,
  buildCatchallMultiAccountChannelSchema,
  buildNestedDmConfigSchema,
} from "../channels/plugins/config-schema.js";
/** Re-exported API for src/plugin-sdk. */
export {
  BlockStreamingCoalesceSchema,
  ContextVisibilityModeSchema,
  DmConfigSchema,
  DmPolicySchema,
  GroupPolicySchema,
  MarkdownConfigSchema,
  ReplyRuntimeConfigSchemaShape,
  requireAllowlistAllowFrom,
  requireOpenAllowFrom,
} from "../config/zod-schema.core.js";
/** Re-exported API for src/plugin-sdk, starting with Tool Policy Schema. */
export { ToolPolicySchema } from "../config/zod-schema.agent-runtime.js";
/** Re-exported API for src/plugin-sdk. */
export {
  DiscordConfigSchema,
  IMessageConfigSchema,
  MSTeamsConfigSchema,
  SignalConfigSchema,
  SlackConfigSchema,
  TelegramConfigSchema,
} from "../config/zod-schema.providers-core.js";
/** Re-exported API for src/plugin-sdk, starting with Google Chat Config Schema. */
export { GoogleChatConfigSchema } from "../config/zod-schema.providers-googlechat.js";
/** Re-exported API for src/plugin-sdk, starting with Whats App Config Schema. */
export { WhatsAppConfigSchema } from "../config/zod-schema.providers-whatsapp.js";
