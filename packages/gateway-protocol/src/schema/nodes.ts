// packages/gateway-protocol/src/schema nodes helpers and runtime behavior.
import { Type } from "typebox";
import { NonEmptyString } from "./primitives.js";

const NodePendingWorkTypeSchema = Type.String({
  enum: ["status.request", "location.request"],
});

const NodePendingWorkPrioritySchema = Type.String({
  enum: ["normal", "high"],
});

/** Public constant for Node Presence Alive Reason Schema behavior in packages/gateway-protocol. */
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

/** Public constant for Node Presence Alive Payload Schema behavior in packages/gateway-protocol. */
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

/** Public constant for Node Event Result Schema behavior in packages/gateway-protocol. */
export const NodeEventResultSchema = Type.Object(
  {
    ok: Type.Boolean(),
    event: NonEmptyString,
    handled: Type.Boolean(),
    reason: Type.Optional(NonEmptyString),
  },
  { additionalProperties: false },
);

/** Public constant for Node Pair Request Params Schema behavior in packages/gateway-protocol. */
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

/** Public constant for Node Pair List Params Schema behavior in packages/gateway-protocol. */
export const NodePairListParamsSchema = Type.Object({}, { additionalProperties: false });

/** Public constant for Node Pair Approve Params Schema behavior in packages/gateway-protocol. */
export const NodePairApproveParamsSchema = Type.Object(
  { requestId: NonEmptyString },
  { additionalProperties: false },
);

/** Public constant for Node Pair Reject Params Schema behavior in packages/gateway-protocol. */
export const NodePairRejectParamsSchema = Type.Object(
  { requestId: NonEmptyString },
  { additionalProperties: false },
);

/** Public constant for Node Pair Remove Params Schema behavior in packages/gateway-protocol. */
export const NodePairRemoveParamsSchema = Type.Object(
  { nodeId: NonEmptyString },
  { additionalProperties: false },
);

/** Public constant for Node Pair Verify Params Schema behavior in packages/gateway-protocol. */
export const NodePairVerifyParamsSchema = Type.Object(
  { nodeId: NonEmptyString, token: NonEmptyString },
  { additionalProperties: false },
);

/** Public constant for Node Rename Params Schema behavior in packages/gateway-protocol. */
export const NodeRenameParamsSchema = Type.Object(
  { nodeId: NonEmptyString, displayName: NonEmptyString },
  { additionalProperties: false },
);

/** Public constant for Node List Params Schema behavior in packages/gateway-protocol. */
export const NodeListParamsSchema = Type.Object({}, { additionalProperties: false });

/** Public constant for Node Pending Ack Params Schema behavior in packages/gateway-protocol. */
export const NodePendingAckParamsSchema = Type.Object(
  {
    ids: Type.Array(NonEmptyString, { minItems: 1 }),
  },
  { additionalProperties: false },
);

/** Public constant for Node Describe Params Schema behavior in packages/gateway-protocol. */
export const NodeDescribeParamsSchema = Type.Object(
  { nodeId: NonEmptyString },
  { additionalProperties: false },
);

/** Public constant for Node Invoke Params Schema behavior in packages/gateway-protocol. */
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

/** Public constant for Node Invoke Result Params Schema behavior in packages/gateway-protocol. */
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

/** Public constant for Node Event Params Schema behavior in packages/gateway-protocol. */
export const NodeEventParamsSchema = Type.Object(
  {
    event: NonEmptyString,
    payload: Type.Optional(Type.Unknown()),
    payloadJSON: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

/** Public constant for Node Pending Drain Params Schema behavior in packages/gateway-protocol. */
export const NodePendingDrainParamsSchema = Type.Object(
  {
    maxItems: Type.Optional(Type.Integer({ minimum: 1, maximum: 10 })),
  },
  { additionalProperties: false },
);

/** Public constant for Node Pending Drain Item Schema behavior in packages/gateway-protocol. */
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

/** Public constant for Node Pending Drain Result Schema behavior in packages/gateway-protocol. */
export const NodePendingDrainResultSchema = Type.Object(
  {
    nodeId: NonEmptyString,
    revision: Type.Integer({ minimum: 0 }),
    items: Type.Array(NodePendingDrainItemSchema),
    hasMore: Type.Boolean(),
  },
  { additionalProperties: false },
);

/** Public constant for Node Pending Enqueue Params Schema behavior in packages/gateway-protocol. */
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

/** Public constant for Node Pending Enqueue Result Schema behavior in packages/gateway-protocol. */
export const NodePendingEnqueueResultSchema = Type.Object(
  {
    nodeId: NonEmptyString,
    revision: Type.Integer({ minimum: 0 }),
    queued: NodePendingDrainItemSchema,
    wakeTriggered: Type.Boolean(),
  },
  { additionalProperties: false },
);

/** Public constant for Node Invoke Request Event Schema behavior in packages/gateway-protocol. */
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
