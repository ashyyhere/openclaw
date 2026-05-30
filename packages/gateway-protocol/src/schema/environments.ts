// Gateway protocol schemas for listing and inspecting runtime environments.
import { Type } from "typebox";
import { NonEmptyString } from "./primitives.js";

/** Lifecycle state reported for an environment that can host agent work. */
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

/** Public summary returned by environment list and status calls. */
export const EnvironmentSummarySchema = createEnvironmentSummarySchema();

/** Empty params contract for enumerating all known environments. */
export const EnvironmentsListParamsSchema = Type.Object({}, { additionalProperties: false });

/** Result contract for the environment catalog shown by gateway clients. */
export const EnvironmentsListResultSchema = Type.Object(
  {
    environments: Type.Array(EnvironmentSummarySchema),
  },
  { additionalProperties: false },
);

/** Params contract for querying one environment by stable id. */
export const EnvironmentsStatusParamsSchema = Type.Object(
  { environmentId: NonEmptyString },
  { additionalProperties: false },
);

/** Result contract for the current status snapshot of one environment. */
export const EnvironmentsStatusResultSchema = createEnvironmentSummarySchema();
