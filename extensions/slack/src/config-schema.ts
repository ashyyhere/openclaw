// extensions/slack/src config schema helpers and runtime behavior.
import { buildChannelConfigSchema, SlackConfigSchema } from "../config-api.js";
import { slackChannelConfigUiHints } from "./config-ui-hints.js";

export const SlackChannelConfigSchema = buildChannelConfigSchema(SlackConfigSchema, {
  uiHints: slackChannelConfigUiHints,
});
