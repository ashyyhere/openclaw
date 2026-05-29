// TypeBox schemas for gateway config editing, schema lookup, and update RPCs.
import { Type } from "typebox";
import { NonEmptyString } from "./primitives.js";

const ConfigSchemaLookupPathString = Type.String({
  minLength: 1,
  maxLength: 1024,
  pattern: "^[A-Za-z0-9_./\\[\\]\\-*]+$",
});

const ConfigDeliveryContextSchema = Type.Object(
  {
    channel: Type.Optional(Type.String()),
    to: Type.Optional(Type.String()),
    accountId: Type.Optional(Type.String()),
    threadId: Type.Optional(Type.Union([Type.String(), Type.Number()])),
  },
  { additionalProperties: false },
);

/** Empty params schema for reading the current raw config document. */
export const ConfigGetParamsSchema = Type.Object({}, { additionalProperties: false });

/** Params schema for replacing raw config with optional optimistic hash guard. */
export const ConfigSetParamsSchema = Type.Object(
  {
    raw: NonEmptyString,
    baseHash: Type.Optional(NonEmptyString),
  },
  { additionalProperties: false },
);

const ConfigApplyLikeParamsSchema = Type.Object(
  {
    raw: NonEmptyString,
    baseHash: Type.Optional(NonEmptyString),
    sessionKey: Type.Optional(Type.String()),
    deliveryContext: Type.Optional(ConfigDeliveryContextSchema),
    note: Type.Optional(Type.String()),
    restartDelayMs: Type.Optional(Type.Integer({ minimum: 0 })),
  },
  { additionalProperties: false },
);

/** Params schema for applying config and scheduling any required restart. */
export const ConfigApplyParamsSchema = ConfigApplyLikeParamsSchema;
/** Params schema for patch-style config updates with the same apply metadata. */
export const ConfigPatchParamsSchema = ConfigApplyLikeParamsSchema;

/** Empty params schema for requesting the generated config schema. */
export const ConfigSchemaParamsSchema = Type.Object({}, { additionalProperties: false });

/** Params schema for looking up a config schema node by path. */
export const ConfigSchemaLookupParamsSchema = Type.Object(
  {
    path: ConfigSchemaLookupPathString,
  },
  { additionalProperties: false },
);

/** Empty params schema for reading pending update/restart status. */
export const UpdateStatusParamsSchema = Type.Object({}, { additionalProperties: false });

/** Params schema for running an update/restart flow with optional delivery context. */
export const UpdateRunParamsSchema = Type.Object(
  {
    sessionKey: Type.Optional(Type.String()),
    deliveryContext: Type.Optional(ConfigDeliveryContextSchema),
    note: Type.Optional(Type.String()),
    continuationMessage: Type.Optional(Type.String()),
    restartDelayMs: Type.Optional(Type.Integer({ minimum: 0 })),
    timeoutMs: Type.Optional(Type.Integer({ minimum: 1 })),
  },
  { additionalProperties: false },
);

/** UI metadata attached to generated config schema nodes. */
export const ConfigUiHintSchema = Type.Object(
  {
    label: Type.Optional(Type.String()),
    help: Type.Optional(Type.String()),
    tags: Type.Optional(Type.Array(Type.String())),
    group: Type.Optional(Type.String()),
    order: Type.Optional(Type.Integer()),
    advanced: Type.Optional(Type.Boolean()),
    sensitive: Type.Optional(Type.Boolean()),
    placeholder: Type.Optional(Type.String()),
    itemTemplate: Type.Optional(Type.Unknown()),
  },
  { additionalProperties: false },
);

/** Response schema for generated config schema plus UI hints and versioning. */
export const ConfigSchemaResponseSchema = Type.Object(
  {
    schema: Type.Unknown(),
    uiHints: Type.Record(Type.String(), ConfigUiHintSchema),
    version: NonEmptyString,
    generatedAt: NonEmptyString,
  },
  { additionalProperties: false },
);

/** Child node summary returned by config schema lookup. */
export const ConfigSchemaLookupChildSchema = Type.Object(
  {
    key: NonEmptyString,
    path: NonEmptyString,
    type: Type.Optional(Type.Union([Type.String(), Type.Array(Type.String())])),
    required: Type.Boolean(),
    hasChildren: Type.Boolean(),
    reloadKind: Type.Optional(
      Type.Union([Type.Literal("restart"), Type.Literal("hot"), Type.Literal("none")]),
    ),
    hint: Type.Optional(ConfigUiHintSchema),
    hintPath: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

/** Lookup result for a config path, including reload semantics and children. */
export const ConfigSchemaLookupResultSchema = Type.Object(
  {
    path: NonEmptyString,
    schema: Type.Unknown(),
    reloadKind: Type.Optional(
      Type.Union([Type.Literal("restart"), Type.Literal("hot"), Type.Literal("none")]),
    ),
    hint: Type.Optional(ConfigUiHintSchema),
    hintPath: Type.Optional(Type.String()),
    children: Type.Array(ConfigSchemaLookupChildSchema),
  },
  { additionalProperties: false },
);
