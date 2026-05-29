// src/plugin-sdk command auth native helpers and runtime behavior.
/** Re-exported API for src/plugin-sdk. */
export {
  buildCommandTextFromArgs,
  findCommandByNativeName,
  formatCommandArgMenuTitle,
  listChatCommands,
  listNativeCommandSpecs,
  listNativeCommandSpecsForConfig,
  maybeResolveTextAlias,
  normalizeCommandBody,
  parseCommandArgs,
  serializeCommandArgs,
  resolveCommandArgChoices,
  resolveCommandArgMenu,
} from "../auto-reply/commands-registry.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  ChatCommandDefinition,
  CommandArgDefinition,
  CommandArgValues,
  CommandArgs,
  NativeCommandSpec,
} from "../auto-reply/commands-registry.js";
/** Re-exported API for src/plugin-sdk, starting with Command Args Parsing. */
export type { CommandArgsParsing } from "../auto-reply/commands-registry.types.js";
/** Re-exported API for src/plugin-sdk. */
export {
  hasControlCommand,
  shouldComputeCommandAuthorized,
} from "../auto-reply/command-detection.js";
/** Re-exported API for src/plugin-sdk. */
export {
  resolveCommandAuthorizedFromAuthorizers,
  resolveControlCommandGate,
} from "../channels/command-gating.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Native Command Session Targets. */
export { resolveNativeCommandSessionTargets } from "../channels/native-command-session-targets.js";
/** Re-exported API for src/plugin-sdk. */
export {
  resolveCommandAuthorization,
  type CommandAuthorization,
} from "../auto-reply/command-auth.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Stored Model Override. */
export { resolveStoredModelOverride } from "../auto-reply/reply/stored-model-override.js";
/** Re-exported API for src/plugin-sdk, starting with Models Provider Data. */
export type { ModelsProviderData } from "../auto-reply/reply/commands-models.js";
/** Re-exported API for src/plugin-sdk, starting with list Skill Commands For Agents. */
export { listSkillCommandsForAgents } from "../skills/discovery/chat-commands.js";
/** Re-exported API for src/plugin-sdk, starting with list Provider Plugin Command Specs. */
export { listProviderPluginCommandSpecs } from "../plugins/command-specs.js";
