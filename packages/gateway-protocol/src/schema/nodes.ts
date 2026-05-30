// Gateway protocol schemas for paired node presence, pairing, invocation, and pending work.
import { Type } from "typebox";
import { NonEmptyString } from "./primitives.js";

const NodePendingWorkTypeSchema = Type.String({
  enum: ["status.request", "location.request"],
});

const NodePendingWorkPrioritySchema = Type.String({
  enum: ["normal", "high"],
});

/** Reasons a paired node can report itself alive to the gateway. */
export const NodePresenceAliveReasonSchema = Type.String({
  enum: [
    "background",
    "silent_push",
    "bg_app_refresh",
    "significant_location",
    "manual",
    "connect",
  ],
});

/** Presence payload sent by paired nodes with optional device metadata. */
export const NodePresenceAlivePayloadSchema = Type.Object(
  {
    trigger: NodePresenceAliveReasonSchema,
    sentAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
    displayName: Type.Optional(NonEmptyString),
    version: Type.Optional(NonEmptyString),
    platform: Type.Optional(NonEmptyString),
    deviceFamily: Type.Optional(NonEmptyString),
    modelIdentifier: Type.Optional(NonEmptyString),
    pushTransport: Type.Optional(NonEmptyString),
  },
  { additionalProperties: false },
);

/** Result payload returned after routing a node-originated event. */
export const NodeEventResultSchema = Type.Object(
  {
    ok: Type.Boolean(),
    event: NonEmptyString,
    handled: Type.Boolean(),
    reason: Type.Optional(NonEmptyString),
  },
  { additionalProperties: false },
);

/** Pairing request payload advertised by a node before approval. */
export const NodePairRequestParamsSchema = Type.Object(
  {
    nodeId: NonEmptyString,
    displayName: Type.Optional(NonEmptyString),
    platform: Type.Optional(NonEmptyString),
    version: Type.Optional(NonEmptyString),
    coreVersion: Type.Optional(NonEmptyString),
    uiVersion: Type.Optional(NonEmptyString),
    deviceFamily: Type.Optional(NonEmptyString),
    modelIdentifier: Type.Optional(NonEmptyString),
    caps: Type.Optional(Type.Array(NonEmptyString)),
    commands: Type.Optional(Type.Array(NonEmptyString)),
    permissions: Type.Optional(Type.Record(NonEmptyString, Type.Boolean())),
    remoteIp: Type.Optional(NonEmptyString),
    silent: Type.Optional(Type.Boolean()),
  },
  { additionalProperties: false },
);

/** Empty params contract for listing pending node pair requests. */
export const NodePairListParamsSchema = Type.Object({}, { additionalProperties: false });

/** Params for approving one pending node pair request. */
export const NodePairApproveParamsSchema = Type.Object(
  { requestId: NonEmptyString },
  { additionalProperties: false },
);

/** Params for rejecting one pending node pair request. */
export const NodePairRejectParamsSchema = Type.Object(
  { requestId: NonEmptyString },
  { additionalProperties: false },
);

/** Params for removing a paired node by id. */
export const NodePairRemoveParamsSchema = Type.Object(
  { nodeId: NonEmptyString },
  { additionalProperties: false },
);

/** Params for verifying a node pairing token. */
export const NodePairVerifyParamsSchema = Type.Object(
  { nodeId: NonEmptyString, token: NonEmptyString },
  { additionalProperties: false },
);

/** Params for updating the display name of a paired node. */
export const NodeRenameParamsSchema = Type.Object(
  { nodeId: NonEmptyString, displayName: NonEmptyString },
  { additionalProperties: false },
);

/** Empty params contract for listing paired nodes. */
export const NodeListParamsSchema = Type.Object({}, { additionalProperties: false });

/** Ack payload for pending node work ids after successful handling. */
export const NodePendingAckParamsSchema = Type.Object(
  {
    ids: Type.Array(NonEmptyString, { minItems: 1 }),
  },
  { additionalProperties: false },
);

/** Params for reading one paired node's current descriptor. */
export const NodeDescribeParamsSchema = Type.Object(
  { nodeId: NonEmptyString },
  { additionalProperties: false },
);

/** Gateway-to-node command invocation request. */
export const NodeInvokeParamsSchema = Type.Object(
  {
    nodeId: NonEmptyString,
    command: NonEmptyString,
    params: Type.Optional(Type.Unknown()),
    timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
    idempotencyKey: NonEmptyString,
  },
  { additionalProperties: false },
);

/** Node-to-gateway command invocation result payload. */
export const NodeInvokeResultParamsSchema = Type.Object(
  {
    id: NonEmptyString,
    nodeId: NonEmptyString,
    ok: Type.Boolean(),
    payload: Type.Optional(Type.Unknown()),
    payloadJSON: Type.Optional(Type.String()),
    error: Type.Optional(
      Type.Object(
        {
          code: Type.Optional(NonEmptyString),
          message: Type.Optional(NonEmptyString),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

/** Node-originated event payload with optional JSON-encoded data. */
export const NodeEventParamsSchema = Type.Object(
  {
    event: NonEmptyString,
    payload: Type.Optional(Type.Unknown()),
    payloadJSON: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

/** Params for draining a bounded batch of pending work for a node. */
export const NodePendingDrainParamsSchema = Type.Object(
  {
    maxItems: Type.Optional(Type.Integer({ minimum: 1, maximum: 10 })),
  },
  { additionalProperties: false },
);

/** One queued pending-work item assigned to a node. */
export const NodePendingDrainItemSchema = Type.Object(
  {
    id: NonEmptyString,
    type: NodePendingWorkTypeSchema,
    priority: Type.String({ enum: ["default", "normal", "high"] }),
    createdAtMs: Type.Integer({ minimum: 0 }),
    expiresAtMs: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
    payload: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
  },
  { additionalProperties: false },
);

/** Drain result with queue revision, items, and has-more state. */
export const NodePendingDrainResultSchema = Type.Object(
  {
    nodeId: NonEmptyString,
    revision: Type.Integer({ minimum: 0 }),
    items: Type.Array(NodePendingDrainItemSchema),
    hasMore: Type.Boolean(),
  },
  { additionalProperties: false },
);

/** Params for enqueueing work for a node and optionally waking it. */
export const NodePendingEnqueueParamsSchema = Type.Object(
  {
    nodeId: NonEmptyString,
    type: NodePendingWorkTypeSchema,
    priority: Type.Optional(NodePendingWorkPrioritySchema),
    expiresInMs: Type.Optional(Type.Integer({ minimum: 1_000, maximum: 86_400_000 })),
    wake: Type.Optional(Type.Boolean()),
  },
  { additionalProperties: false },
);

/** Enqueue result with queued item, queue revision, and wake outcome. */
export const NodePendingEnqueueResultSchema = Type.Object(
  {
    nodeId: NonEmptyString,
    revision: Type.Integer({ minimum: 0 }),
    queued: NodePendingDrainItemSchema,
    wakeTriggered: Type.Boolean(),
  },
  { additionalProperties: false },
);

/** Event payload emitted to a node when a gateway command invocation is pending. */
export const NodeInvokeRequestEventSchema = Type.Object(
  {
    id: NonEmptyString,
    nodeId: NonEmptyString,
    command: NonEmptyString,
    paramsJSON: Type.Optional(Type.String()),
    timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
    idempotencyKey: Type.Optional(NonEmptyString),
  },
  { additionalProperties: false },
);
