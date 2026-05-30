// Gateway protocol schemas for listing, inspecting, and downloading run artifacts.
import { Type } from "typebox";
import { NonEmptyString } from "./primitives.js";

const ArtifactQueryParamsProperties = {
  sessionKey: Type.Optional(NonEmptyString),
  runId: Type.Optional(NonEmptyString),
  taskId: Type.Optional(NonEmptyString),
  agentId: Type.Optional(NonEmptyString),
};

/** Shared optional filters for narrowing artifact lookups to a session, run, task, or agent. */
export const ArtifactQueryParamsSchema = Type.Object(ArtifactQueryParamsProperties, {
  additionalProperties: false,
});

/** Lookup params for endpoints that address one artifact inside the optional query scope. */
export const ArtifactGetParamsSchema = Type.Object(
  {
    ...ArtifactQueryParamsProperties,
    artifactId: NonEmptyString,
  },
  { additionalProperties: false },
);

/** Public metadata for an artifact without embedding the artifact payload itself. */
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

/** Params contract for listing artifacts with the shared query filters. */
export const ArtifactsListParamsSchema = ArtifactQueryParamsSchema;

/** Result contract for artifact list responses. */
export const ArtifactsListResultSchema = Type.Object(
  {
    artifacts: Type.Array(ArtifactSummarySchema),
  },
  { additionalProperties: false },
);

/** Params contract for fetching artifact metadata. */
export const ArtifactsGetParamsSchema = ArtifactGetParamsSchema;

/** Result contract for fetching a single artifact summary. */
export const ArtifactsGetResultSchema = Type.Object(
  {
    artifact: ArtifactSummarySchema,
  },
  { additionalProperties: false },
);

/** Params contract for retrieving an artifact payload or download URL. */
export const ArtifactsDownloadParamsSchema = ArtifactGetParamsSchema;

/** Download result contract; payloads may be inline base64 data or an external URL. */
export const ArtifactsDownloadResultSchema = Type.Object(
  {
    artifact: ArtifactSummarySchema,
    encoding: Type.Optional(Type.Literal("base64")),
    data: Type.Optional(Type.String()),
    url: Type.Optional(NonEmptyString),
  },
  { additionalProperties: false },
);
