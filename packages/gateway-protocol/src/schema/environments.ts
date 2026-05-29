// packages/gateway-protocol/src/schema environments helpers and runtime behavior.
import { Type } from "typebox";
import { NonEmptyString } from "./primitives.js";

/** Public constant for Environment Status Schema behavior in packages/gateway-protocol. */
export const EnvironmentStatusSchema = Type.String({
  enum: ["available", "unavailable", "starting", "stopping", "error"],
});

function createEnvironmentSummarySchema() {
  return Type.Object(
    {
      id: NonEmptyString,
      type: NonEmptyString,
      label: Type.Optional(NonEmptyString),
      status: EnvironmentStatusSchema,
      capabilities: Type.Optional(Type.Array(NonEmptyString)),
    },
    { additionalProperties: false },
  );
}

/** Public constant for Environment Summary Schema behavior in packages/gateway-protocol. */
export const EnvironmentSummarySchema = createEnvironmentSummarySchema();

/** Public constant for Environments List Params Schema behavior in packages/gateway-protocol. */
export const EnvironmentsListParamsSchema = Type.Object({}, { additionalProperties: false });

/** Public constant for Environments List Result Schema behavior in packages/gateway-protocol. */
export const EnvironmentsListResultSchema = Type.Object(
  {
    environments: Type.Array(EnvironmentSummarySchema),
  },
  { additionalProperties: false },
);

/** Public constant for Environments Status Params Schema behavior in packages/gateway-protocol. */
export const EnvironmentsStatusParamsSchema = Type.Object(
  { environmentId: NonEmptyString },
  { additionalProperties: false },
);

/** Public constant for Environments Status Result Schema behavior in packages/gateway-protocol. */
export const EnvironmentsStatusResultSchema = createEnvironmentSummarySchema();
