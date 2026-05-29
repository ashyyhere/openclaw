// extensions/msteams/src config schema helpers and runtime behavior.
import { buildChannelConfigSchema, MSTeamsConfigSchema } from "../config-api.js";
import { msTeamsChannelConfigUiHints } from "./config-ui-hints.js";

export const MSTeamsChannelConfigSchema = buildChannelConfigSchema(MSTeamsConfigSchema, {
  uiHints: msTeamsChannelConfigUiHints,
});
