// Gateway protocol schemas for secret reloads and command-scoped secret resolution.
import { Type, type Static } from "typebox";
import { NonEmptyString } from "./primitives.js";

/** Empty params contract for asking the gateway to reload secret providers. */
export const SecretsReloadParamsSchema = Type.Object({}, { additionalProperties: false });

/** Resolve request describing targets and allowed secret paths for one command. */
export const SecretsResolveParamsSchema = Type.Object(
  {
    commandName: NonEmptyString,
    targetIds: Type.Array(NonEmptyString),
    allowedPaths: Type.Optional(Type.Array(NonEmptyString)),
    forcedActivePaths: Type.Optional(Type.Array(NonEmptyString)),
    optionalActivePaths: Type.Optional(Type.Array(NonEmptyString)),
    providerOverrides: Type.Optional(
      Type.Object(
        {
          webSearch: Type.Optional(NonEmptyString),
          webFetch: Type.Optional(NonEmptyString),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

/** Static TypeScript type for secret resolution requests. */
export type SecretsResolveParams = Static<typeof SecretsResolveParamsSchema>;

/** One resolved secret assignment returned with its target path segments. */
export const SecretsResolveAssignmentSchema = Type.Object(
  {
    path: Type.Optional(NonEmptyString),
    pathSegments: Type.Array(NonEmptyString),
    value: Type.Unknown(),
  },
  { additionalProperties: false },
);

/** Resolution result with assignments, diagnostics, and inactive reference paths. */
export const SecretsResolveResultSchema = Type.Object(
  {
    ok: Type.Optional(Type.Boolean()),
    assignments: Type.Optional(Type.Array(SecretsResolveAssignmentSchema)),
    diagnostics: Type.Optional(Type.Array(NonEmptyString)),
    inactiveRefPaths: Type.Optional(Type.Array(NonEmptyString)),
  },
  { additionalProperties: false },
);

/** Static TypeScript type for secret resolution results. */
export type SecretsResolveResult = Static<typeof SecretsResolveResultSchema>;
