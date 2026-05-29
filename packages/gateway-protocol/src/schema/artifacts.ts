// packages/gateway-protocol/src/schema artifacts helpers and runtime behavior.
import { Type } from "typebox";
import { NonEmptyString } from "./primitives.js";

const ArtifactQueryParamsProperties = {
  sessionKey: Type.Optional(NonEmptyString),
  runId: Type.Optional(NonEmptyString),
  taskId: Type.Optional(NonEmptyString),
  agentId: Type.Optional(NonEmptyString),
};

/** Public constant for Artifact Query Params Schema behavior in packages/gateway-protocol. */
export const ArtifactQueryParamsSchema = Type.Object(ArtifactQueryParamsProperties, {
  additionalProperties: false,
});

/** Public constant for Artifact Get Params Schema behavior in packages/gateway-protocol. */
export const ArtifactGetParamsSchema = Type.Object(
  {
    ...ArtifactQueryParamsProperties,
    artifactId: NonEmptyString,
  },
  { additionalProperties: false },
);

/** Public constant for Artifact Summary Schema behavior in packages/gateway-protocol. */
export const ArtifactSummarySchema = Type.Object(
  {
    id: NonEmptyString,
    type: NonEmptyString,
    title: NonEmptyString,
    mimeType: Type.Optional(NonEmptyString),
    sizeBytes: Type.Optional(Type.Integer({ minimum: 0 })),
    sessionKey: Type.Optional(NonEmptyString),
    runId: Type.Optional(NonEmptyString),
    taskId: Type.Optional(NonEmptyString),
    messageSeq: Type.Optional(Type.Integer({ minimum: 1 })),
    source: Type.Optional(NonEmptyString),
    download: Type.Object(
      {
        mode: Type.Union([Type.Literal("bytes"), Type.Literal("url"), Type.Literal("unsupported")]),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

/** Public constant for Artifacts List Params Schema behavior in packages/gateway-protocol. */
export const ArtifactsListParamsSchema = ArtifactQueryParamsSchema;

/** Public constant for Artifacts List Result Schema behavior in packages/gateway-protocol. */
export const ArtifactsListResultSchema = Type.Object(
  {
    artifacts: Type.Array(ArtifactSummarySchema),
  },
  { additionalProperties: false },
);

/** Public constant for Artifacts Get Params Schema behavior in packages/gateway-protocol. */
export const ArtifactsGetParamsSchema = ArtifactGetParamsSchema;

/** Public constant for Artifacts Get Result Schema behavior in packages/gateway-protocol. */
export const ArtifactsGetResultSchema = Type.Object(
  {
    artifact: ArtifactSummarySchema,
  },
  { additionalProperties: false },
);

/** Public constant for Artifacts Download Params Schema behavior in packages/gateway-protocol. */
export const ArtifactsDownloadParamsSchema = ArtifactGetParamsSchema;

/** Public constant for Artifacts Download Result Schema behavior in packages/gateway-protocol. */
export const ArtifactsDownloadResultSchema = Type.Object(
  {
    artifact: ArtifactSummarySchema,
    encoding: Type.Optional(Type.Literal("base64")),
    data: Type.Optional(Type.String()),
    url: Type.Optional(NonEmptyString),
  },
  { additionalProperties: false },
);
