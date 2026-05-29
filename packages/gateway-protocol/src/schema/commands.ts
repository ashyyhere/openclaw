// TypeBox schemas and bounds for gateway command catalog responses.
import { Type } from "typebox";
import { NonEmptyString } from "./primitives.js";

/** Maximum command or alias name length accepted in catalog payloads. */
export const COMMAND_NAME_MAX_LENGTH = 200;
/** Maximum human-facing command description length. */
export const COMMAND_DESCRIPTION_MAX_LENGTH = 2_000;
/** Maximum text aliases attached to one command. */
export const COMMAND_ALIAS_MAX_ITEMS = 20;
/** Maximum argument descriptors attached to one command. */
export const COMMAND_ARGS_MAX_ITEMS = 20;
/** Maximum command argument name length. */
export const COMMAND_ARG_NAME_MAX_LENGTH = 200;
/** Maximum command argument help text length. */
export const COMMAND_ARG_DESCRIPTION_MAX_LENGTH = 500;
/** Maximum static choices attached to one command argument. */
export const COMMAND_ARG_CHOICES_MAX_ITEMS = 50;
/** Maximum machine value length for one command argument choice. */
export const COMMAND_CHOICE_VALUE_MAX_LENGTH = 200;
/** Maximum display label length for one command argument choice. */
export const COMMAND_CHOICE_LABEL_MAX_LENGTH = 200;
/** Maximum commands returned by a single catalog response. */
export const COMMAND_LIST_MAX_ITEMS = 500;

const BoundedNonEmptyString = (maxLength: number) => Type.String({ minLength: 1, maxLength });

/** Source category for a command exposed by core, skills, or plugins. */
export const CommandSourceSchema = Type.Union([
  Type.Literal("native"),
  Type.Literal("skill"),
  Type.Literal("plugin"),
]);

/** Invocation surface where a command can be used. */
export const CommandScopeSchema = Type.Union([
  Type.Literal("text"),
  Type.Literal("native"),
  Type.Literal("both"),
]);

/** Display grouping for command catalog entries. */
export const CommandCategorySchema = Type.Union([
  Type.Literal("session"),
  Type.Literal("options"),
  Type.Literal("status"),
  Type.Literal("management"),
  Type.Literal("media"),
  Type.Literal("tools"),
  Type.Literal("docks"),
]);

/** Static choice descriptor for a command argument. */
export const CommandArgChoiceSchema = Type.Object(
  {
    value: Type.String({ maxLength: COMMAND_CHOICE_VALUE_MAX_LENGTH }),
    label: Type.String({ maxLength: COMMAND_CHOICE_LABEL_MAX_LENGTH }),
  },
  { additionalProperties: false },
);

/** Argument descriptor for a command catalog entry. */
export const CommandArgSchema = Type.Object(
  {
    name: BoundedNonEmptyString(COMMAND_ARG_NAME_MAX_LENGTH),
    description: Type.String({ maxLength: COMMAND_ARG_DESCRIPTION_MAX_LENGTH }),
    type: Type.Union([Type.Literal("string"), Type.Literal("number"), Type.Literal("boolean")]),
    required: Type.Optional(Type.Boolean()),
    choices: Type.Optional(
      Type.Array(CommandArgChoiceSchema, { maxItems: COMMAND_ARG_CHOICES_MAX_ITEMS }),
    ),
    dynamic: Type.Optional(Type.Boolean()),
  },
  { additionalProperties: false },
);

/** Full command catalog entry returned to clients. */
export const CommandEntrySchema = Type.Object(
  {
    name: BoundedNonEmptyString(COMMAND_NAME_MAX_LENGTH),
    nativeName: Type.Optional(BoundedNonEmptyString(COMMAND_NAME_MAX_LENGTH)),
    textAliases: Type.Optional(
      Type.Array(BoundedNonEmptyString(COMMAND_NAME_MAX_LENGTH), {
        maxItems: COMMAND_ALIAS_MAX_ITEMS,
      }),
    ),
    description: Type.String({ maxLength: COMMAND_DESCRIPTION_MAX_LENGTH }),
    category: Type.Optional(CommandCategorySchema),
    source: CommandSourceSchema,
    scope: CommandScopeSchema,
    acceptsArgs: Type.Boolean(),
    args: Type.Optional(Type.Array(CommandArgSchema, { maxItems: COMMAND_ARGS_MAX_ITEMS })),
  },
  { additionalProperties: false },
);

/** Params schema for filtering command catalog listings. */
export const CommandsListParamsSchema = Type.Object(
  {
    agentId: Type.Optional(NonEmptyString),
    provider: Type.Optional(NonEmptyString),
    scope: Type.Optional(CommandScopeSchema),
    includeArgs: Type.Optional(Type.Boolean()),
  },
  { additionalProperties: false },
);

/** Result schema for command catalog listings. */
export const CommandsListResultSchema = Type.Object(
  {
    commands: Type.Array(CommandEntrySchema, { maxItems: COMMAND_LIST_MAX_ITEMS }),
  },
  { additionalProperties: false },
);
