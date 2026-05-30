// Native command authorization SDK surface. Exposes command registry parsing,
// detection, gating, session target, model override, and plugin command helpers.
/** Command registry lookup, parsing, serialization, and menu helpers. */
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
/** Command definition and argument contracts. */
export type {
  ChatCommandDefinition,
  CommandArgDefinition,
  CommandArgValues,
  CommandArgs,
  NativeCommandSpec,
} from "../auto-reply/commands-registry.js";
/** Command argument parsing strategy contract. */
export type { CommandArgsParsing } from "../auto-reply/commands-registry.types.js";
/** Control-command detection helpers. */
export {
  hasControlCommand,
  shouldComputeCommandAuthorized,
} from "../auto-reply/command-detection.js";
/** Command authorizer composition and gate resolution helpers. */
export {
  resolveCommandAuthorizedFromAuthorizers,
  resolveControlCommandGate,
} from "../channels/command-gating.js";
/** Resolves sessions affected by native command invocations. */
export { resolveNativeCommandSessionTargets } from "../channels/native-command-session-targets.js";
/** Command authorization resolver and result contract. */
export {
  resolveCommandAuthorization,
  type CommandAuthorization,
} from "../auto-reply/command-auth.js";
/** Resolves stored model overrides used by reply commands. */
export { resolveStoredModelOverride } from "../auto-reply/reply/stored-model-override.js";
/** Provider/model data shape used by model-list commands. */
export type { ModelsProviderData } from "../auto-reply/reply/commands-models.js";
/** Lists skill-backed chat commands available to agents. */
export { listSkillCommandsForAgents } from "../skills/discovery/chat-commands.js";
/** Lists native command specs contributed by provider plugins. */
export { listProviderPluginCommandSpecs } from "../plugins/command-specs.js";
