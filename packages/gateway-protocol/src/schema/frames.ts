// Gateway protocol schemas for connection handshake and top-level transport frames.
import { Type } from "typebox";
import { GatewayClientIdSchema, GatewayClientModeSchema, NonEmptyString } from "./primitives.js";
import { SnapshotSchema, StateVersionSchema } from "./snapshot.js";

/** Heartbeat event emitted by the gateway transport. */
export const TickEventSchema = Type.Object(
  {
    ts: Type.Integer({ minimum: 0 }),
  },
  { additionalProperties: false },
);

/** Shutdown event sent before planned gateway restarts or exits. */
export const ShutdownEventSchema = Type.Object(
  {
    reason: NonEmptyString,
    restartExpectedMs: Type.Optional(Type.Integer({ minimum: 0 })),
  },
  { additionalProperties: false },
);

/** Client hello payload used to negotiate protocol, auth, capabilities, and identity. */
export const ConnectParamsSchema = Type.Object(
  {
    minProtocol: Type.Integer({ minimum: 1 }),
    maxProtocol: Type.Integer({ minimum: 1 }),
    client: Type.Object(
      {
        id: GatewayClientIdSchema,
        displayName: Type.Optional(NonEmptyString),
        version: NonEmptyString,
        platform: NonEmptyString,
        deviceFamily: Type.Optional(NonEmptyString),
        modelIdentifier: Type.Optional(NonEmptyString),
        mode: GatewayClientModeSchema,
        instanceId: Type.Optional(NonEmptyString),
      },
      { additionalProperties: false },
    ),
    caps: Type.Optional(Type.Array(NonEmptyString, { default: [] })),
    commands: Type.Optional(Type.Array(NonEmptyString)),
    permissions: Type.Optional(Type.Record(NonEmptyString, Type.Boolean())),
    pathEnv: Type.Optional(Type.String()),
    role: Type.Optional(NonEmptyString),
    scopes: Type.Optional(Type.Array(NonEmptyString)),
    device: Type.Optional(
      Type.Object(
        {
          id: NonEmptyString,
          publicKey: NonEmptyString,
          signature: NonEmptyString,
          signedAt: Type.Integer({ minimum: 0 }),
          nonce: NonEmptyString,
        },
        { additionalProperties: false },
      ),
    ),
    auth: Type.Optional(
      Type.Object(
        {
          token: Type.Optional(Type.String()),
          bootstrapToken: Type.Optional(Type.String()),
          deviceToken: Type.Optional(Type.String()),
          password: Type.Optional(Type.String()),
          approvalRuntimeToken: Type.Optional(Type.String()),
        },
        { additionalProperties: false },
      ),
    ),
    locale: Type.Optional(Type.String()),
    userAgent: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

/** Successful handshake response with negotiated protocol, auth, policy, and snapshot. */
export const HelloOkSchema = Type.Object(
  {
    type: Type.Literal("hello-ok"),
    protocol: Type.Integer({ minimum: 1 }),
    server: Type.Object(
      {
        version: NonEmptyString,
        connId: NonEmptyString,
      },
      { additionalProperties: false },
    ),
    features: Type.Object(
      {
        methods: Type.Array(NonEmptyString),
        events: Type.Array(NonEmptyString),
      },
      { additionalProperties: false },
    ),
    snapshot: SnapshotSchema,
    pluginSurfaceUrls: Type.Optional(Type.Record(NonEmptyString, NonEmptyString)),
    auth: Type.Object(
      {
        deviceToken: Type.Optional(NonEmptyString),
        role: NonEmptyString,
        scopes: Type.Array(NonEmptyString),
        issuedAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
        deviceTokens: Type.Optional(
          Type.Array(
            Type.Object(
              {
                deviceToken: NonEmptyString,
                role: NonEmptyString,
                scopes: Type.Array(NonEmptyString),
                issuedAtMs: Type.Integer({ minimum: 0 }),
              },
              { additionalProperties: false },
            ),
          ),
        ),
      },
      { additionalProperties: false },
    ),
    policy: Type.Object(
      {
        maxPayload: Type.Integer({ minimum: 1 }),
        maxBufferedBytes: Type.Integer({ minimum: 1 }),
        tickIntervalMs: Type.Integer({ minimum: 1 }),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

/** Standard gateway error envelope carried by responses and connection failures. */
export const ErrorShapeSchema = Type.Object(
  {
    code: NonEmptyString,
    message: NonEmptyString,
    details: Type.Optional(Type.Unknown()),
    retryable: Type.Optional(Type.Boolean()),
    retryAfterMs: Type.Optional(Type.Integer({ minimum: 0 })),
  },
  { additionalProperties: false },
);

/** RPC request frame sent by clients over the gateway transport. */
export const RequestFrameSchema = Type.Object(
  {
    type: Type.Literal("req"),
    id: NonEmptyString,
    method: NonEmptyString,
    params: Type.Optional(Type.Unknown()),
  },
  { additionalProperties: false },
);

/** RPC response frame paired with a request id. */
export const ResponseFrameSchema = Type.Object(
  {
    type: Type.Literal("res"),
    id: NonEmptyString,
    ok: Type.Boolean(),
    payload: Type.Optional(Type.Unknown()),
    error: Type.Optional(ErrorShapeSchema),
  },
  { additionalProperties: false },
);

/** Asynchronous event frame emitted by gateway state or runtime changes. */
export const EventFrameSchema = Type.Object(
  {
    type: Type.Literal("event"),
    event: NonEmptyString,
    payload: Type.Optional(Type.Unknown()),
    seq: Type.Optional(Type.Integer({ minimum: 0 })),
    stateVersion: Type.Optional(StateVersionSchema),
  },
  { additionalProperties: false },
);

// Discriminated union of all top-level frames. Using a discriminator makes
// downstream codegen (quicktype) produce tighter types instead of all-optional
// blobs.
/** Discriminated union for every top-level gateway transport frame. */
export const GatewayFrameSchema = Type.Union(
  [RequestFrameSchema, ResponseFrameSchema, EventFrameSchema],
  { discriminator: "type" },
);
