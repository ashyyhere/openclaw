// TypeBox schemas for device pairing, token rotation, and pairing events.
import { Type } from "typebox";
import { NonEmptyString } from "./primitives.js";

/** Empty params schema for listing pending device-pair requests. */
export const DevicePairListParamsSchema = Type.Object({}, { additionalProperties: false });

/** Params schema for approving a pending device-pair request. */
export const DevicePairApproveParamsSchema = Type.Object(
  { requestId: NonEmptyString },
  { additionalProperties: false },
);

/** Params schema for rejecting a pending device-pair request. */
export const DevicePairRejectParamsSchema = Type.Object(
  { requestId: NonEmptyString },
  { additionalProperties: false },
);

/** Params schema for removing a paired device. */
export const DevicePairRemoveParamsSchema = Type.Object(
  { deviceId: NonEmptyString },
  { additionalProperties: false },
);

/** Params schema for rotating a device token for a role and optional scopes. */
export const DeviceTokenRotateParamsSchema = Type.Object(
  {
    deviceId: NonEmptyString,
    role: NonEmptyString,
    scopes: Type.Optional(Type.Array(NonEmptyString)),
  },
  { additionalProperties: false },
);

/** Params schema for revoking one device token role. */
export const DeviceTokenRevokeParamsSchema = Type.Object(
  {
    deviceId: NonEmptyString,
    role: NonEmptyString,
  },
  { additionalProperties: false },
);

/** Event payload emitted when a device requests pairing. */
export const DevicePairRequestedEventSchema = Type.Object(
  {
    requestId: NonEmptyString,
    deviceId: NonEmptyString,
    publicKey: NonEmptyString,
    displayName: Type.Optional(NonEmptyString),
    platform: Type.Optional(NonEmptyString),
    deviceFamily: Type.Optional(NonEmptyString),
    clientId: Type.Optional(NonEmptyString),
    clientMode: Type.Optional(NonEmptyString),
    role: Type.Optional(NonEmptyString),
    roles: Type.Optional(Type.Array(NonEmptyString)),
    scopes: Type.Optional(Type.Array(NonEmptyString)),
    remoteIp: Type.Optional(NonEmptyString),
    silent: Type.Optional(Type.Boolean()),
    isRepair: Type.Optional(Type.Boolean()),
    ts: Type.Integer({ minimum: 0 }),
  },
  { additionalProperties: false },
);

/** Event payload emitted after a device pairing request is resolved. */
export const DevicePairResolvedEventSchema = Type.Object(
  {
    requestId: NonEmptyString,
    deviceId: NonEmptyString,
    decision: NonEmptyString,
    ts: Type.Integer({ minimum: 0 }),
  },
  { additionalProperties: false },
);
