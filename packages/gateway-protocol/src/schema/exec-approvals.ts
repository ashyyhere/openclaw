// Gateway protocol schemas for exec approval policy files and approval prompts.
import { Type } from "typebox";
import { NonEmptyString } from "./primitives.js";

/** One persisted command allowlist rule, including optional audit fields from prior matches. */
export const ExecApprovalsAllowlistEntrySchema = Type.Object(
  {
    id: Type.Optional(NonEmptyString),
    pattern: Type.String(),
    source: Type.Optional(Type.Literal("allow-always")),
    commandText: Type.Optional(Type.String()),
    argPattern: Type.Optional(Type.String()),
    lastUsedAt: Type.Optional(Type.Integer({ minimum: 0 })),
    lastUsedCommand: Type.Optional(Type.String()),
    lastResolvedPath: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

const ExecApprovalsPolicyFields = {
  security: Type.Optional(Type.String()),
  ask: Type.Optional(Type.String()),
  askFallback: Type.Optional(Type.String()),
  autoAllowSkills: Type.Optional(Type.Boolean()),
};

/** Default exec approval policy applied before agent-specific overrides. */
export const ExecApprovalsDefaultsSchema = Type.Object(ExecApprovalsPolicyFields, {
  additionalProperties: false,
});

/** Agent-specific exec approval policy and command allowlist. */
export const ExecApprovalsAgentSchema = Type.Object(
  {
    ...ExecApprovalsPolicyFields,
    allowlist: Type.Optional(Type.Array(ExecApprovalsAllowlistEntrySchema)),
  },
  { additionalProperties: false },
);

/** Versioned on-disk exec approval configuration exchanged through the gateway. */
export const ExecApprovalsFileSchema = Type.Object(
  {
    version: Type.Literal(1),
    socket: Type.Optional(
      Type.Object(
        {
          path: Type.Optional(Type.String()),
          token: Type.Optional(Type.String()),
        },
        { additionalProperties: false },
      ),
    ),
    defaults: Type.Optional(ExecApprovalsDefaultsSchema),
    agents: Type.Optional(Type.Record(Type.String(), ExecApprovalsAgentSchema)),
  },
  { additionalProperties: false },
);

/** File snapshot returned with path, hash, existence, and parsed policy content. */
export const ExecApprovalsSnapshotSchema = Type.Object(
  {
    path: NonEmptyString,
    exists: Type.Boolean(),
    hash: NonEmptyString,
    file: ExecApprovalsFileSchema,
  },
  { additionalProperties: false },
);

/** Empty params contract for reading the local exec approvals file. */
export const ExecApprovalsGetParamsSchema = Type.Object({}, { additionalProperties: false });

/** Write params for replacing the local exec approvals file with optional hash guarding. */
export const ExecApprovalsSetParamsSchema = Type.Object(
  {
    file: ExecApprovalsFileSchema,
    baseHash: Type.Optional(NonEmptyString),
  },
  { additionalProperties: false },
);

/** Params contract for reading exec approvals from a paired node. */
export const ExecApprovalsNodeGetParamsSchema = Type.Object(
  {
    nodeId: NonEmptyString,
  },
  { additionalProperties: false },
);

/** Write params for replacing a paired node's exec approvals file. */
export const ExecApprovalsNodeSetParamsSchema = Type.Object(
  {
    nodeId: NonEmptyString,
    file: ExecApprovalsFileSchema,
    baseHash: Type.Optional(NonEmptyString),
  },
  { additionalProperties: false },
);

/** Params contract for looking up one pending approval by request id. */
export const ExecApprovalGetParamsSchema = Type.Object(
  {
    id: NonEmptyString,
  },
  { additionalProperties: false },
);

/** Prompt payload describing a command request that needs an approval decision. */
export const ExecApprovalRequestParamsSchema = Type.Object(
  {
    id: Type.Optional(NonEmptyString),
    command: Type.Optional(NonEmptyString),
    commandArgv: Type.Optional(Type.Array(Type.String())),
    systemRunPlan: Type.Optional(
      Type.Object(
        {
          argv: Type.Array(Type.String()),
          cwd: Type.Union([Type.String(), Type.Null()]),
          commandText: Type.String(),
          commandPreview: Type.Optional(Type.Union([Type.String(), Type.Null()])),
          agentId: Type.Union([Type.String(), Type.Null()]),
          sessionKey: Type.Union([Type.String(), Type.Null()]),
          mutableFileOperand: Type.Optional(
            Type.Union([
              Type.Object(
                {
                  argvIndex: Type.Integer({ minimum: 0 }),
                  path: Type.String(),
                  sha256: Type.String(),
                },
                { additionalProperties: false },
              ),
              Type.Null(),
            ]),
          ),
        },
        { additionalProperties: false },
      ),
    ),
    env: Type.Optional(Type.Record(NonEmptyString, Type.String())),
    cwd: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    nodeId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
    host: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    security: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    ask: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    warningText: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    commandSpans: Type.Optional(
      Type.Array(
        Type.Object(
          {
            startIndex: Type.Integer({
              minimum: 0,
              description: "Inclusive UTF-16 code unit offset into command.",
            }),
            endIndex: Type.Integer({
              minimum: 1,
              description:
                "Exclusive UTF-16 code unit offset into command; must be greater than startIndex and no greater than command.length.",
            }),
          },
          { additionalProperties: false },
        ),
      ),
    ),
    agentId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    resolvedPath: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    sessionKey: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    turnSourceChannel: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    turnSourceTo: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    turnSourceAccountId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    turnSourceThreadId: Type.Optional(Type.Union([Type.String(), Type.Number(), Type.Null()])),
    requireDeliveryRoute: Type.Optional(Type.Boolean()),
    suppressDelivery: Type.Optional(Type.Boolean()),
    timeoutMs: Type.Optional(Type.Integer({ minimum: 1 })),
    twoPhase: Type.Optional(Type.Boolean()),
  },
  { additionalProperties: false },
);

/** Resolution payload for accepting, denying, or otherwise completing an approval request. */
export const ExecApprovalResolveParamsSchema = Type.Object(
  {
    id: NonEmptyString,
    decision: NonEmptyString,
  },
  { additionalProperties: false },
);
