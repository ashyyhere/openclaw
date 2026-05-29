// extensions/googlechat/src config schema helpers and runtime behavior.
import { buildChannelConfigSchema, GoogleChatConfigSchema } from "../config-api.js";

export const GoogleChatChannelConfigSchema = buildChannelConfigSchema(GoogleChatConfigSchema);
