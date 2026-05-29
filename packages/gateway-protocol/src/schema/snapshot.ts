// TypeBox schemas for gateway status snapshots sent to clients.
import { Type } from "typebox";
import { NonEmptyString } from "./primitives.js";

/** One connected client or node presence entry in a gateway snapshot. */
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

/** Gateway health payload is intentionally open-ended for producer-owned fields. */
export const HealthSnapshotSchema = Type.Any();

/** Default session identifiers and scope advertised by the gateway. */
export const SessionDefaultsSchema = Type.Object(
  {
    defaultAgentId: NonEmptyString,
    mainKey: NonEmptyString,
    mainSessionKey: NonEmptyString,
    scope: Type.Optional(NonEmptyString),
  },
  { additionalProperties: false },
);

/** Monotonic state versions used by clients to detect snapshot freshness. */
export const StateVersionSchema = Type.Object(
  {
    presence: Type.Integer({ minimum: 0 }),
    health: Type.Integer({ minimum: 0 }),
  },
  { additionalProperties: false },
);

/** Full gateway snapshot sent after connection and state changes. */
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
