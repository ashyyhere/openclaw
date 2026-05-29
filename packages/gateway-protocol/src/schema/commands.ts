// packages/gateway-protocol/src/schema commands helpers and runtime behavior.
import { Type } from "typebox";
import { NonEmptyString } from "./primitives.js";

/** Public constant for COMMAND NAME MAX LENGTH behavior in packages/gateway-protocol. */
export const COMMAND_NAME_MAX_LENGTH = 200;
/** Public constant for COMMAND DESCRIPTION MAX LENGTH behavior in packages/gateway-protocol. */
export const COMMAND_DESCRIPTION_MAX_LENGTH = 2_000;
/** Public constant for COMMAND ALIAS MAX ITEMS behavior in packages/gateway-protocol. */
export const COMMAND_ALIAS_MAX_ITEMS = 20;
/** Public constant for COMMAND ARGS MAX ITEMS behavior in packages/gateway-protocol. */
export const COMMAND_ARGS_MAX_ITEMS = 20;
/** Public constant for COMMAND ARG NAME MAX LENGTH behavior in packages/gateway-protocol. */
export const COMMAND_ARG_NAME_MAX_LENGTH = 200;
/** Public constant for COMMAND ARG DESCRIPTION MAX LENGTH behavior in packages/gateway-protocol. */
export const COMMAND_ARG_DESCRIPTION_MAX_LENGTH = 500;
/** Public constant for COMMAND ARG CHOICES MAX ITEMS behavior in packages/gateway-protocol. */
export const COMMAND_ARG_CHOICES_MAX_ITEMS = 50;
/** Public constant for COMMAND CHOICE VALUE MAX LENGTH behavior in packages/gateway-protocol. */
export const COMMAND_CHOICE_VALUE_MAX_LENGTH = 200;
/** Public constant for COMMAND CHOICE LABEL MAX LENGTH behavior in packages/gateway-protocol. */
export const COMMAND_CHOICE_LABEL_MAX_LENGTH = 200;
/** Public constant for COMMAND LIST MAX ITEMS behavior in packages/gateway-protocol. */
export const COMMAND_LIST_MAX_ITEMS = 500;

const BoundedNonEmptyString = (maxLength: number) => Type.String({ minLength: 1, maxLength });

/** Public constant for Command Source Schema behavior in packages/gateway-protocol. */
export const CommandSourceSchema = Type.Union([
  Type.Literal("native"),
  Type.Literal("skill"),
  Type.Literal("plugin"),
]);

/** Public constant for Command Scope Schema behavior in packages/gateway-protocol. */
export const CommandScopeSchema = Type.Union([
  Type.Literal("text"),
  Type.Literal("native"),
  Type.Literal("both"),
]);

/** Public constant for Command Category Schema behavior in packages/gateway-protocol. */
export const CommandCategorySchema = Type.Union([
  Type.Literal("session"),
  Type.Literal("options"),
  Type.Literal("status"),
  Type.Literal("management"),
  Type.Literal("media"),
  Type.Literal("tools"),
  Type.Literal("docks"),
]);

/** Public constant for Command Arg Choice Schema behavior in packages/gateway-protocol. */
export const CommandArgChoiceSchema = Type.Object(
  {
    value: Type.String({ maxLength: COMMAND_CHOICE_VALUE_MAX_LENGTH }),
    label: Type.String({ maxLength: COMMAND_CHOICE_LABEL_MAX_LENGTH }),
  },
  { additionalProperties: false },
);

/** Public constant for Command Arg Schema behavior in packages/gateway-protocol. */
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

/** Public constant for Command Entry Schema behavior in packages/gateway-protocol. */
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

/** Public constant for Commands List Params Schema behavior in packages/gateway-protocol. */
export const CommandsListParamsSchema = Type.Object(
  {
    agentId: Type.Optional(NonEmptyString),
    provider: Type.Optional(NonEmptyString),
    scope: Type.Optional(CommandScopeSchema),
    includeArgs: Type.Optional(Type.Boolean()),
  },
  { additionalProperties: false },
);

/** Public constant for Commands List Result Schema behavior in packages/gateway-protocol. */
export const CommandsListResultSchema = Type.Object(
  {
    commands: Type.Array(CommandEntrySchema, { maxItems: COMMAND_LIST_MAX_ITEMS }),
  },
  { additionalProperties: false },
);
