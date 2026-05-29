// packages/gateway-protocol/src/schema push helpers and runtime behavior.
import { Type } from "typebox";
import { NonEmptyString } from "./primitives.js";

const ApnsEnvironmentSchema = Type.String({ enum: ["sandbox", "production"] });

/** Public constant for Push Test Params Schema behavior in packages/gateway-protocol. */
export const PushTestParamsSchema = Type.Object(
  {
    nodeId: NonEmptyString,
    title: Type.Optional(Type.String()),
    body: Type.Optional(Type.String()),
    environment: Type.Optional(ApnsEnvironmentSchema),
  },
  { additionalProperties: false },
);

/** Public constant for Push Test Result Schema behavior in packages/gateway-protocol. */
export const PushTestResultSchema = Type.Object(
  {
    ok: Type.Boolean(),
    status: Type.Integer(),
    apnsId: Type.Optional(Type.String()),
    reason: Type.Optional(Type.String()),
    tokenSuffix: Type.String(),
    topic: Type.String(),
    environment: ApnsEnvironmentSchema,
    transport: Type.String({ enum: ["direct", "relay"] }),
  },
  { additionalProperties: false },
);

// --- Web Push schemas ---

const WebPushKeysSchema = Type.Object(
  {
    p256dh: Type.String({ minLength: 1, maxLength: 512 }),
    auth: Type.String({ minLength: 1, maxLength: 512 }),
  },
  { additionalProperties: false },
);

/** Public constant for Web Push Vapid Public Key Params Schema behavior in packages/gateway-protocol. */
export const WebPushVapidPublicKeyParamsSchema = Type.Object({}, { additionalProperties: false });

/** Public constant for Web Push Subscribe Params Schema behavior in packages/gateway-protocol. */
export const WebPushSubscribeParamsSchema = Type.Object(
  {
    endpoint: Type.String({ minLength: 1, maxLength: 2048, pattern: "^https://" }),
    keys: WebPushKeysSchema,
  },
  { additionalProperties: false },
);

/** Public constant for Web Push Unsubscribe Params Schema behavior in packages/gateway-protocol. */
export const WebPushUnsubscribeParamsSchema = Type.Object(
  {
    endpoint: Type.String({ minLength: 1, maxLength: 2048, pattern: "^https://" }),
  },
  { additionalProperties: false },
);

/** Public constant for Web Push Test Params Schema behavior in packages/gateway-protocol. */
export const WebPushTestParamsSchema = Type.Object(
  {
    title: Type.Optional(Type.String()),
    body: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

/** Public type describing Web Push Vapid Public Key Params for packages/gateway-protocol. */
export type WebPushVapidPublicKeyParams = Record<string, never>;
/** Public type describing Web Push Subscribe Params for packages/gateway-protocol. */
export type WebPushSubscribeParams = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};
/** Public type describing Web Push Unsubscribe Params for packages/gateway-protocol. */
export type WebPushUnsubscribeParams = {
  endpoint: string;
};
/** Public type describing Web Push Test Params for packages/gateway-protocol. */
export type WebPushTestParams = {
  title?: string;
  body?: string;
};
