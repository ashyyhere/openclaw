// packages/gateway-protocol/src/schema config helpers and runtime behavior.
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

/** Public constant for Config Get Params Schema behavior in packages/gateway-protocol. */
export const ConfigGetParamsSchema = Type.Object({}, { additionalProperties: false });

/** Public constant for Config Set Params Schema behavior in packages/gateway-protocol. */
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

/** Public constant for Config Apply Params Schema behavior in packages/gateway-protocol. */
export const ConfigApplyParamsSchema = ConfigApplyLikeParamsSchema;
/** Public constant for Config Patch Params Schema behavior in packages/gateway-protocol. */
export const ConfigPatchParamsSchema = ConfigApplyLikeParamsSchema;

/** Public constant for Config Schema Params Schema behavior in packages/gateway-protocol. */
export const ConfigSchemaParamsSchema = Type.Object({}, { additionalProperties: false });

/** Public constant for Config Schema Lookup Params Schema behavior in packages/gateway-protocol. */
export const ConfigSchemaLookupParamsSchema = Type.Object(
  {
    path: ConfigSchemaLookupPathString,
  },
  { additionalProperties: false },
);

/** Public constant for Update Status Params Schema behavior in packages/gateway-protocol. */
export const UpdateStatusParamsSchema = Type.Object({}, { additionalProperties: false });

/** Public constant for Update Run Params Schema behavior in packages/gateway-protocol. */
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

/** Public constant for Config Ui Hint Schema behavior in packages/gateway-protocol. */
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

/** Public constant for Config Schema Response Schema behavior in packages/gateway-protocol. */
export const ConfigSchemaResponseSchema = Type.Object(
  {
    schema: Type.Unknown(),
    uiHints: Type.Record(Type.String(), ConfigUiHintSchema),
    version: NonEmptyString,
    generatedAt: NonEmptyString,
  },
  { additionalProperties: false },
);

/** Public constant for Config Schema Lookup Child Schema behavior in packages/gateway-protocol. */
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

/** Public constant for Config Schema Lookup Result Schema behavior in packages/gateway-protocol. */
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
