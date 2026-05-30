// Gateway protocol schemas for interactive setup wizard sessions.
import { Type } from "typebox";
import { NonEmptyString } from "./primitives.js";

const WizardRunStatusSchema = Type.Union([
  Type.Literal("running"),
  Type.Literal("done"),
  Type.Literal("cancelled"),
  Type.Literal("error"),
]);

/** Params for starting a local or remote setup wizard run. */
export const WizardStartParamsSchema = Type.Object(
  {
    mode: Type.Optional(Type.Union([Type.Literal("local"), Type.Literal("remote")])),
    workspace: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

/** Answer payload submitted for the current wizard step. */
export const WizardAnswerSchema = Type.Object(
  {
    stepId: NonEmptyString,
    value: Type.Optional(Type.Unknown()),
  },
  { additionalProperties: false },
);

/** Params for advancing a wizard session with an optional answer. */
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

/** Params for cancelling an active wizard session. */
export const WizardCancelParamsSchema = WizardSessionIdParamsSchema;

/** Params for reading the status of an active or finished wizard session. */
export const WizardStatusParamsSchema = WizardSessionIdParamsSchema;

/** Selectable option shown by wizard steps that present choices. */
export const WizardStepOptionSchema = Type.Object(
  {
    value: Type.Unknown(),
    label: NonEmptyString,
    hint: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

/** Client-renderable wizard step contract for prompts, progress, and actions. */
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

/** Result for advancing a wizard session, including the next step when not done. */
export const WizardNextResultSchema = Type.Object(WizardResultFields, {
  additionalProperties: false,
});

/** Result for starting a wizard session, including its new session id. */
export const WizardStartResultSchema = Type.Object(
  {
    sessionId: NonEmptyString,
    ...WizardResultFields,
  },
  { additionalProperties: false },
);

/** Status result for a wizard session after clients reconnect or poll. */
export const WizardStatusResultSchema = Type.Object(
  {
    status: WizardRunStatusSchema,
    error: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);
