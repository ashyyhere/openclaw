// extensions/discord/src/monitor agent components auth helpers and runtime behavior.
export { resolveInteractionContextWithDmAuth } from "./agent-components-dm-auth.js";
export {
  ensureAgentComponentInteractionAllowed,
  ensureComponentUserAllowed,
  resolveAuthorizedComponentInteraction,
  resolveComponentCommandAuthorized,
} from "./agent-components-guild-auth.js";
