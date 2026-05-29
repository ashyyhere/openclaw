// packages/gateway-protocol/src/schema plugins helpers and runtime behavior.
import { Type } from "typebox";
import { NonEmptyString } from "./primitives.js";

/** Public constant for Plugin Json Value Schema behavior in packages/gateway-protocol. */
export const PluginJsonValueSchema = Type.Unknown();

/** Public constant for Plugin Control Ui Descriptor Schema behavior in packages/gateway-protocol. */
export const PluginControlUiDescriptorSchema = Type.Object(
  {
    id: NonEmptyString,
    pluginId: NonEmptyString,
    pluginName: Type.Optional(NonEmptyString),
    surface: Type.Union([
      Type.Literal("session"),
      Type.Literal("tool"),
      Type.Literal("run"),
      Type.Literal("settings"),
    ]),
    label: NonEmptyString,
    description: Type.Optional(Type.String()),
    placement: Type.Optional(Type.String()),
    schema: Type.Optional(PluginJsonValueSchema),
    requiredScopes: Type.Optional(Type.Array(NonEmptyString)),
  },
  { additionalProperties: false },
);

/** Public constant for Plugins Ui Descriptors Params Schema behavior in packages/gateway-protocol. */
export const PluginsUiDescriptorsParamsSchema = Type.Object({}, { additionalProperties: false });

/** Public constant for Plugins Ui Descriptors Result Schema behavior in packages/gateway-protocol. */
export const PluginsUiDescriptorsResultSchema = Type.Object(
  {
    ok: Type.Literal(true),
    descriptors: Type.Array(PluginControlUiDescriptorSchema),
  },
  { additionalProperties: false },
);

/** Public constant for Plugins Session Action Params Schema behavior in packages/gateway-protocol. */
export const PluginsSessionActionParamsSchema = Type.Object(
  {
    pluginId: NonEmptyString,
    actionId: NonEmptyString,
    sessionKey: Type.Optional(NonEmptyString),
    payload: Type.Optional(PluginJsonValueSchema),
  },
  { additionalProperties: false },
);

/** Public constant for Plugins Session Action Success Result Schema behavior in packages/gateway-protocol. */
export const PluginsSessionActionSuccessResultSchema = Type.Object(
  {
    ok: Type.Literal(true),
    result: Type.Optional(PluginJsonValueSchema),
    continueAgent: Type.Optional(Type.Boolean()),
    reply: Type.Optional(PluginJsonValueSchema),
  },
  { additionalProperties: false },
);

/** Public constant for Plugins Session Action Failure Result Schema behavior in packages/gateway-protocol. */
export const PluginsSessionActionFailureResultSchema = Type.Object(
  {
    ok: Type.Literal(false),
    error: Type.String(),
    code: Type.Optional(Type.String()),
    details: Type.Optional(PluginJsonValueSchema),
  },
  { additionalProperties: false },
);

/** Public constant for Plugins Session Action Result Schema behavior in packages/gateway-protocol. */
export const PluginsSessionActionResultSchema = Type.Union([
  PluginsSessionActionSuccessResultSchema,
  PluginsSessionActionFailureResultSchema,
]);
