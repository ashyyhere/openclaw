// Shared TypeBox primitives reused across gateway protocol schemas.
import { Type } from "typebox";
import { GATEWAY_CLIENT_IDS, GATEWAY_CLIENT_MODES } from "../client-info.js";
import {
  EXEC_SECRET_REF_ID_JSON_SCHEMA_PATTERN,
  FILE_SECRET_REF_ID_ABSOLUTE_JSON_SCHEMA_PATTERN,
  FILE_SECRET_REF_ID_INVALID_ESCAPE_JSON_SCHEMA_PATTERN,
  SECRET_PROVIDER_ALIAS_PATTERN,
  SINGLE_VALUE_FILE_REF_ID,
} from "../secret-ref-contract.js";

const ENV_SECRET_REF_ID_RE = /^[A-Z][A-Z0-9_]{0,127}$/;
const INPUT_PROVENANCE_KIND_VALUES = ["external_user", "inter_session", "internal_system"] as const;
const SESSION_LABEL_MAX_LENGTH = 512;

/** Generic string schema for required non-empty identifiers and names. */
export const NonEmptyString = Type.String({ minLength: 1 });
/** Maximum session key length accepted by chat send routes. */
export const CHAT_SEND_SESSION_KEY_MAX_LENGTH = 512;
/** Session key string schema for chat send payloads. */
export const ChatSendSessionKeyString = Type.String({
  minLength: 1,
  maxLength: CHAT_SEND_SESSION_KEY_MAX_LENGTH,
});
/** Human-visible session label with the shared UI/storage length cap. */
export const SessionLabelString = Type.String({
  minLength: 1,
  maxLength: SESSION_LABEL_MAX_LENGTH,
});
/** Provenance metadata for inputs copied from users, sessions, tools, or systems. */
export const InputProvenanceSchema = Type.Object(
  {
    kind: Type.String({ enum: [...INPUT_PROVENANCE_KIND_VALUES] }),
    originSessionId: Type.Optional(Type.String()),
    sourceSessionKey: Type.Optional(Type.String()),
    sourceChannel: Type.Optional(Type.String()),
    sourceTool: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

/** Schema for the stable client ids advertised during gateway connection setup. */
export const GatewayClientIdSchema = Type.Enum(GATEWAY_CLIENT_IDS);

/** Schema for coarse gateway client runtime modes. */
export const GatewayClientModeSchema = Type.Enum(GATEWAY_CLIENT_MODES);

/** Allowed secret resolver backends referenced in protocol payloads. */
export const SecretRefSourceSchema = Type.Union([
  Type.Literal("env"),
  Type.Literal("file"),
  Type.Literal("exec"),
]);

const SecretProviderAliasString = Type.String({
  pattern: SECRET_PROVIDER_ALIAS_PATTERN.source,
});

const EnvSecretRefSchema = Type.Object(
  {
    source: Type.Literal("env"),
    provider: SecretProviderAliasString,
    id: Type.String({ pattern: ENV_SECRET_REF_ID_RE.source }),
  },
  { additionalProperties: false },
);

const FileSecretRefIdSchema = Type.Unsafe<string>({
  type: "string",
  anyOf: [
    { const: SINGLE_VALUE_FILE_REF_ID },
    {
      allOf: [
        { pattern: FILE_SECRET_REF_ID_ABSOLUTE_JSON_SCHEMA_PATTERN },
        { not: { pattern: FILE_SECRET_REF_ID_INVALID_ESCAPE_JSON_SCHEMA_PATTERN } },
      ],
    },
  ],
});

const FileSecretRefSchema = Type.Object(
  {
    source: Type.Literal("file"),
    provider: SecretProviderAliasString,
    id: FileSecretRefIdSchema,
  },
  { additionalProperties: false },
);

const ExecSecretRefSchema = Type.Object(
  {
    source: Type.Literal("exec"),
    provider: SecretProviderAliasString,
    id: Type.String({ pattern: EXEC_SECRET_REF_ID_JSON_SCHEMA_PATTERN }),
  },
  { additionalProperties: false },
);

/** Structured reference to a secret resolved by env, file, or exec providers. */
export const SecretRefSchema = Type.Union([
  EnvSecretRefSchema,
  FileSecretRefSchema,
  ExecSecretRefSchema,
]);

/** Secret-bearing input can be an inline string or structured secret reference. */
export const SecretInputSchema = Type.Union([Type.String(), SecretRefSchema]);
