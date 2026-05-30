// Public type model for command registry definitions and routing.
import type { OpenClawConfig } from "../config/types.js";
import type { CommandArgValues } from "./commands-args.types.js";
import type { ThinkingCatalogEntry } from "./thinking.shared.js";

/** Parsed command argument values shared with command definitions. */
export type { CommandArgValues, CommandArgs } from "./commands-args.types.js";

/** Surfaces where a command can be handled. */
export type CommandScope = "text" | "native" | "both";

/**
 * Controls progressive disclosure of commands in the UI.
 * - "essential": Always visible (~10 core commands)
 * - "standard": Shown on expand / "Show more" (~15 commands)
 * - "power": Only surfaced via search or explicit filter (~15 commands)
 */
export type CommandTier = "essential" | "standard" | "power";

/** Functional command grouping used by UI search and disclosure. */
export type CommandCategory =
  | "session"
  | "options"
  | "status"
  | "management"
  | "media"
  | "tools"
  | "docks";

type CommandArgType = "string" | "number" | "boolean";

/** Runtime context passed to dynamic command argument choice providers. */
export type CommandArgChoiceContext = {
  cfg?: OpenClawConfig;
  provider?: string;
  model?: string;
  catalog?: ThinkingCatalogEntry[];
  command: ChatCommandDefinition;
  arg: CommandArgDefinition;
};

/** Static or labeled choice returned for a command argument. */
export type CommandArgChoice = string | { value: string; label: string };

type CommandArgChoicesProvider = (context: CommandArgChoiceContext) => CommandArgChoice[];

/** Declarative metadata for parsing and presenting one command argument. */
export type CommandArgDefinition = {
  name: string;
  description: string;
  type: CommandArgType;
  required?: boolean;
  choices?: CommandArgChoice[] | CommandArgChoicesProvider;
  preferAutocomplete?: boolean;
  captureRemaining?: boolean;
};

/** Menu metadata for command arguments that should open a picker. */
export type CommandArgMenuSpec = {
  arg: string;
  title?: string;
};

/** Supported command argument parsing strategies. */
export type CommandArgsParsing = "none" | "positional";

/** Canonical command registry entry shared by text and native command surfaces. */
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

/** Command shape exposed to native command-capable chat surfaces. */
export type NativeCommandSpec = {
  name: string;
  description: string;
  descriptionLocalizations?: Record<string, string>;
  acceptsArgs: boolean;
  args?: CommandArgDefinition[];
  isAlias?: boolean;
};

/** Options for normalizing command mentions from text input. */
export type CommandNormalizeOptions = {
  botUsername?: string;
};

/** Precomputed exact and regex matchers for text-command detection. */
export type CommandDetection = {
  exact: Set<string>;
  regex: RegExp;
};

/** Input used to decide whether text commands are enabled for a surface. */
export type ShouldHandleTextCommandsParams = {
  cfg: OpenClawConfig;
  surface: string;
  commandSource?: "text" | "native";
};
