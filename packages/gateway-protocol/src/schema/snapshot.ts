// packages/gateway-protocol/src/schema snapshot helpers and runtime behavior.
import { Type } from "typebox";
import { NonEmptyString } from "./primitives.js";

/** Public constant for Presence Entry Schema behavior in packages/gateway-protocol. */
export const PresenceEntrySchema = Type.Object(
  {
    host: Type.Optional(NonEmptyString),
    ip: Type.Optional(NonEmptyString),
    version: Type.Optional(NonEmptyString),
    platform: Type.Optional(NonEmptyString),
    deviceFamily: Type.Optional(NonEmptyString),
    modelIdentifier: Type.Optional(NonEmptyString),
    mode: Type.Optional(NonEmptyString),
    lastInputSeconds: Type.Optional(Type.Integer({ minimum: 0 })),
    reason: Type.Optional(NonEmptyString),
    tags: Type.Optional(Type.Array(NonEmptyString)),
    text: Type.Optional(Type.String()),
    ts: Type.Integer({ minimum: 0 }),
    deviceId: Type.Optional(NonEmptyString),
    roles: Type.Optional(Type.Array(NonEmptyString)),
    scopes: Type.Optional(Type.Array(NonEmptyString)),
    instanceId: Type.Optional(NonEmptyString),
  },
  { additionalProperties: false },
);

/** Public constant for Health Snapshot Schema behavior in packages/gateway-protocol. */
export const HealthSnapshotSchema = Type.Any();

/** Public constant for Session Defaults Schema behavior in packages/gateway-protocol. */
export const SessionDefaultsSchema = Type.Object(
  {
    defaultAgentId: NonEmptyString,
    mainKey: NonEmptyString,
    mainSessionKey: NonEmptyString,
    scope: Type.Optional(NonEmptyString),
  },
  { additionalProperties: false },
);

/** Public constant for State Version Schema behavior in packages/gateway-protocol. */
export const StateVersionSchema = Type.Object(
  {
    presence: Type.Integer({ minimum: 0 }),
    health: Type.Integer({ minimum: 0 }),
  },
  { additionalProperties: false },
);

/** Public constant for Snapshot Schema behavior in packages/gateway-protocol. */
export const SnapshotSchema = Type.Object(
  {
    presence: Type.Array(PresenceEntrySchema),
    health: HealthSnapshotSchema,
    stateVersion: StateVersionSchema,
    uptimeMs: Type.Integer({ minimum: 0 }),
    configPath: Type.Optional(NonEmptyString),
    stateDir: Type.Optional(NonEmptyString),
    sessionDefaults: Type.Optional(SessionDefaultsSchema),
    authMode: Type.Optional(
      Type.Union([
        Type.Literal("none"),
        Type.Literal("token"),
        Type.Literal("password"),
        Type.Literal("trusted-proxy"),
      ]),
    ),
    updateAvailable: Type.Optional(
      Type.Object({
        currentVersion: NonEmptyString,
        latestVersion: NonEmptyString,
        channel: NonEmptyString,
      }),
    ),
  },
  { additionalProperties: false },
);
