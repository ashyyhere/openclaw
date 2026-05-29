// extensions/mattermost/src config surface helpers and runtime behavior.
import { buildChannelConfigSchema } from "openclaw/plugin-sdk/channel-config-primitives";
import { MattermostConfigSchema } from "./config-schema-core.js";
import { mattermostChannelConfigUiHints } from "./config-ui-hints.js";

export const MattermostChannelConfigSchema = buildChannelConfigSchema(MattermostConfigSchema, {
  uiHints: mattermostChannelConfigUiHints,
});
