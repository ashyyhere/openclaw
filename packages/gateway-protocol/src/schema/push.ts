// Gateway protocol schemas for APNs push testing and browser Web Push subscriptions.
import { Type } from "typebox";
import { NonEmptyString } from "./primitives.js";

const ApnsEnvironmentSchema = Type.String({ enum: ["sandbox", "production"] });

/** Params for sending a test APNs notification to a paired node. */
export const PushTestParamsSchema = Type.Object(
  {
    nodeId: NonEmptyString,
    title: Type.Optional(Type.String()),
    body: Type.Optional(Type.String()),
    environment: Type.Optional(ApnsEnvironmentSchema),
  },
  { additionalProperties: false },
);

/** Result for an APNs push test, including provider status and token diagnostics. */
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

/** Empty params contract for requesting the gateway Web Push VAPID public key. */
export const WebPushVapidPublicKeyParamsSchema = Type.Object({}, { additionalProperties: false });

/** Browser Web Push subscription payload with endpoint and encryption keys. */
export const WebPushSubscribeParamsSchema = Type.Object(
  {
    endpoint: Type.String({ minLength: 1, maxLength: 2048, pattern: "^https://" }),
    keys: WebPushKeysSchema,
  },
  { additionalProperties: false },
);

/** Browser Web Push unsubscribe payload keyed by endpoint. */
export const WebPushUnsubscribeParamsSchema = Type.Object(
  {
    endpoint: Type.String({ minLength: 1, maxLength: 2048, pattern: "^https://" }),
  },
  { additionalProperties: false },
);

/** Params for sending a test notification to the current Web Push subscription. */
export const WebPushTestParamsSchema = Type.Object(
  {
    title: Type.Optional(Type.String()),
    body: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

/** TypeScript params type for requesting the Web Push VAPID public key. */
export type WebPushVapidPublicKeyParams = Record<string, never>;
/** TypeScript params type for registering a browser Web Push subscription. */
export type WebPushSubscribeParams = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};
/** TypeScript params type for removing a browser Web Push subscription. */
export type WebPushUnsubscribeParams = {
  endpoint: string;
};
/** TypeScript params type for sending a browser Web Push test notification. */
export type WebPushTestParams = {
  title?: string;
  body?: string;
};
