// packages/gateway-protocol/src/schema wizard helpers and runtime behavior.
import { Type } from "typebox";
import { NonEmptyString } from "./primitives.js";

const WizardRunStatusSchema = Type.Union([
  Type.Literal("running"),
  Type.Literal("done"),
  Type.Literal("cancelled"),
  Type.Literal("error"),
]);

/** Public constant for Wizard Start Params Schema behavior in packages/gateway-protocol. */
export const WizardStartParamsSchema = Type.Object(
  {
    mode: Type.Optional(Type.Union([Type.Literal("local"), Type.Literal("remote")])),
    workspace: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

/** Public constant for Wizard Answer Schema behavior in packages/gateway-protocol. */
export const WizardAnswerSchema = Type.Object(
  {
    stepId: NonEmptyString,
    value: Type.Optional(Type.Unknown()),
  },
  { additionalProperties: false },
);

/** Public constant for Wizard Next Params Schema behavior in packages/gateway-protocol. */
export const WizardNextParamsSchema = Type.Object(
  {
    sessionId: NonEmptyString,
    answer: Type.Optional(WizardAnswerSchema),
  },
  { additionalProperties: false },
);

const WizardSessionIdParamsSchema = Type.Object(
  {
    sessionId: NonEmptyString,
  },
  { additionalProperties: false },
);

/** Public constant for Wizard Cancel Params Schema behavior in packages/gateway-protocol. */
export const WizardCancelParamsSchema = WizardSessionIdParamsSchema;

/** Public constant for Wizard Status Params Schema behavior in packages/gateway-protocol. */
export const WizardStatusParamsSchema = WizardSessionIdParamsSchema;

/** Public constant for Wizard Step Option Schema behavior in packages/gateway-protocol. */
export const WizardStepOptionSchema = Type.Object(
  {
    value: Type.Unknown(),
    label: NonEmptyString,
    hint: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

/** Public constant for Wizard Step Schema behavior in packages/gateway-protocol. */
export const WizardStepSchema = Type.Object(
  {
    id: NonEmptyString,
    type: Type.Union([
      Type.Literal("note"),
      Type.Literal("select"),
      Type.Literal("text"),
      Type.Literal("confirm"),
      Type.Literal("multiselect"),
      Type.Literal("progress"),
      Type.Literal("action"),
    ]),
    title: Type.Optional(Type.String()),
    message: Type.Optional(Type.String()),
    format: Type.Optional(Type.Union([Type.Literal("plain")])),
    options: Type.Optional(Type.Array(WizardStepOptionSchema)),
    initialValue: Type.Optional(Type.Unknown()),
    placeholder: Type.Optional(Type.String()),
    sensitive: Type.Optional(Type.Boolean()),
    executor: Type.Optional(Type.Union([Type.Literal("gateway"), Type.Literal("client")])),
  },
  { additionalProperties: false },
);

const WizardResultFields = {
  done: Type.Boolean(),
  step: Type.Optional(WizardStepSchema),
  status: Type.Optional(WizardRunStatusSchema),
  error: Type.Optional(Type.String()),
};

/** Public constant for Wizard Next Result Schema behavior in packages/gateway-protocol. */
export const WizardNextResultSchema = Type.Object(WizardResultFields, {
  additionalProperties: false,
});

/** Public constant for Wizard Start Result Schema behavior in packages/gateway-protocol. */
export const WizardStartResultSchema = Type.Object(
  {
    sessionId: NonEmptyString,
    ...WizardResultFields,
  },
  { additionalProperties: false },
);

/** Public constant for Wizard Status Result Schema behavior in packages/gateway-protocol. */
export const WizardStatusResultSchema = Type.Object(
  {
    status: WizardRunStatusSchema,
    error: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);
