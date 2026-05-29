// packages/gateway-protocol/src/schema devices helpers and runtime behavior.
import { Type } from "typebox";
import { NonEmptyString } from "./primitives.js";

/** Public constant for Device Pair List Params Schema behavior in packages/gateway-protocol. */
export const DevicePairListParamsSchema = Type.Object({}, { additionalProperties: false });

/** Public constant for Device Pair Approve Params Schema behavior in packages/gateway-protocol. */
export const DevicePairApproveParamsSchema = Type.Object(
  { requestId: NonEmptyString },
  { additionalProperties: false },
);

/** Public constant for Device Pair Reject Params Schema behavior in packages/gateway-protocol. */
export const DevicePairRejectParamsSchema = Type.Object(
  { requestId: NonEmptyString },
  { additionalProperties: false },
);

/** Public constant for Device Pair Remove Params Schema behavior in packages/gateway-protocol. */
export const DevicePairRemoveParamsSchema = Type.Object(
  { deviceId: NonEmptyString },
  { additionalProperties: false },
);

/** Public constant for Device Token Rotate Params Schema behavior in packages/gateway-protocol. */
export const DeviceTokenRotateParamsSchema = Type.Object(
  {
    deviceId: NonEmptyString,
    role: NonEmptyString,
    scopes: Type.Optional(Type.Array(NonEmptyString)),
  },
  { additionalProperties: false },
);

/** Public constant for Device Token Revoke Params Schema behavior in packages/gateway-protocol. */
export const DeviceTokenRevokeParamsSchema = Type.Object(
  {
    deviceId: NonEmptyString,
    role: NonEmptyString,
  },
  { additionalProperties: false },
);

/** Public constant for Device Pair Requested Event Schema behavior in packages/gateway-protocol. */
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

/** Public constant for Device Pair Resolved Event Schema behavior in packages/gateway-protocol. */
export const DevicePairResolvedEventSchema = Type.Object(
  {
    requestId: NonEmptyString,
    deviceId: NonEmptyString,
    decision: NonEmptyString,
    ts: Type.Integer({ minimum: 0 }),
  },
  { additionalProperties: false },
);
