// Public type model for command registry definitions and routing.
import type { OpenClawConfig } from "../config/types.js";
import type { CommandArgValues } from "./commands-args.types.js";
import type { ThinkingCatalogEntry } from "./thinking.shared.js";

/** Re-exported API for src/auto-reply, starting with Command Arg Values. */
export type { CommandArgValues, CommandArgs } from "./commands-args.types.js";

/** Shared type for Command Scope in src/auto-reply. */
export type CommandScope = "text" | "native" | "both";

/**
 * Controls progressive disclosure of commands in the UI.
 * - "essential": Always visible (~10 core commands)
 * - "standard": Shown on expand / "Show more" (~15 commands)
 * - "power": Only surfaced via search or explicit filter (~15 commands)
 */
export type CommandTier = "essential" | "standard" | "power";

/** Shared type for Command Category in src/auto-reply. */
export type CommandCategory =
  | "session"
  | "options"
  | "status"
  | "management"
  | "media"
  | "tools"
  | "docks";

type CommandArgType = "string" | "number" | "boolean";

/** Shared type for Command Arg Choice Context in src/auto-reply. */
export type CommandArgChoiceContext = {
  cfg?: OpenClawConfig;
  provider?: string;
  model?: string;
  catalog?: ThinkingCatalogEntry[];
  command: ChatCommandDefinition;
  arg: CommandArgDefinition;
};

/** Shared type for Command Arg Choice in src/auto-reply. */
export type CommandArgChoice = string | { value: string; label: string };

type CommandArgChoicesProvider = (context: CommandArgChoiceContext) => CommandArgChoice[];

/** Shared type for Command Arg Definition in src/auto-reply. */
export type CommandArgDefinition = {
  name: string;
  description: string;
  type: CommandArgType;
  required?: boolean;
  choices?: CommandArgChoice[] | CommandArgChoicesProvider;
  preferAutocomplete?: boolean;
  captureRemaining?: boolean;
};

/** Shared type for Command Arg Menu Spec in src/auto-reply. */
export type CommandArgMenuSpec = {
  arg: string;
  title?: string;
};

/** Shared type for Command Args Parsing in src/auto-reply. */
export type CommandArgsParsing = "none" | "positional";

/** Shared type for Chat Command Definition in src/auto-reply. */
export type ChatCommandDefinition = {
  key: string;
  nativeName?: string;
  nativeAliases?: string[];
  description: string;
  /** Localized descriptions for native command surfaces that support them. */
  descriptionLocalizations?: Record<string, string>;
  textAliases: string[];
  acceptsArgs?: boolean;
  args?: CommandArgDefinition[];
  argsParsing?: CommandArgsParsing;
  formatArgs?: (values: CommandArgValues) => string | undefined;
  argsMenu?: CommandArgMenuSpec | "auto";
  scope: CommandScope;
  category?: CommandCategory;
  /** Progressive disclosure tier. Defaults to "standard" when omitted. */
  tier?: CommandTier;
};

/** Shared type for Native Command Spec in src/auto-reply. */
export type NativeCommandSpec = {
  name: string;
  description: string;
  descriptionLocalizations?: Record<string, string>;
  acceptsArgs: boolean;
  args?: CommandArgDefinition[];
  isAlias?: boolean;
};

/** Shared type for Command Normalize Options in src/auto-reply. */
export type CommandNormalizeOptions = {
  botUsername?: string;
};

/** Shared type for Command Detection in src/auto-reply. */
export type CommandDetection = {
  exact: Set<string>;
  regex: RegExp;
};

/** Shared type for Should Handle Text Commands Params in src/auto-reply. */
export type ShouldHandleTextCommandsParams = {
  cfg: OpenClawConfig;
  surface: string;
  commandSource?: "text" | "native";
};
