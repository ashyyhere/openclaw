// packages/gateway-protocol/src/schema secrets helpers and runtime behavior.
import { Type, type Static } from "typebox";
import { NonEmptyString } from "./primitives.js";

/** Public constant for Secrets Reload Params Schema behavior in packages/gateway-protocol. */
export const SecretsReloadParamsSchema = Type.Object({}, { additionalProperties: false });

/** Public constant for Secrets Resolve Params Schema behavior in packages/gateway-protocol. */
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

/** Public type describing Secrets Resolve Params for packages/gateway-protocol. */
export type SecretsResolveParams = Static<typeof SecretsResolveParamsSchema>;

/** Public constant for Secrets Resolve Assignment Schema behavior in packages/gateway-protocol. */
export const SecretsResolveAssignmentSchema = Type.Object(
  {
    path: Type.Optional(NonEmptyString),
    pathSegments: Type.Array(NonEmptyString),
    value: Type.Unknown(),
  },
  { additionalProperties: false },
);

/** Public constant for Secrets Resolve Result Schema behavior in packages/gateway-protocol. */
export const SecretsResolveResultSchema = Type.Object(
  {
    ok: Type.Optional(Type.Boolean()),
    assignments: Type.Optional(Type.Array(SecretsResolveAssignmentSchema)),
    diagnostics: Type.Optional(Type.Array(NonEmptyString)),
    inactiveRefPaths: Type.Optional(Type.Array(NonEmptyString)),
  },
  { additionalProperties: false },
);

/** Public type describing Secrets Resolve Result for packages/gateway-protocol. */
export type SecretsResolveResult = Static<typeof SecretsResolveResultSchema>;
