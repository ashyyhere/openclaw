// Shared types for media-understanding types behavior.
import type { AuthProfileStore } from "../agents/auth-profiles/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";

type MediaUnderstandingKind = "audio.transcription" | "video.description" | "image.description";

/** Shared type for Media Understanding Capability in src/media-understanding. */
export type MediaUnderstandingCapability = "image" | "audio" | "video";

/** Shared type for Media Understanding Capability Registry in src/media-understanding. */
export type MediaUnderstandingCapabilityRegistry = Map<
  string,
  {
    capabilities?: MediaUnderstandingCapability[];
  }
>;

/** Shared type for Media Attachment in src/media-understanding. */
export type MediaAttachment = {
  path?: string;
  url?: string;
  mime?: string;
  index: number;
  alreadyTranscribed?: boolean;
};

/** Shared type for Media Understanding Output in src/media-understanding. */
export type MediaUnderstandingOutput = {
  kind: MediaUnderstandingKind;
  attachmentIndex: number;
  text: string;
  provider: string;
  model?: string;
};

type MediaUnderstandingDecisionOutcome =
  | "success"
  | "failed"
  | "skipped"
  | "disabled"
  | "no-attachment"
  | "scope-deny";

/** Shared type for Media Understanding Model Decision in src/media-understanding. */
export type MediaUnderstandingModelDecision = {
  provider?: string;
  model?: string;
  type: "provider" | "cli";
  outcome: "success" | "skipped" | "failed";
  reason?: string;
};

type MediaUnderstandingAttachmentDecision = {
  attachmentIndex: number;
  attempts: MediaUnderstandingModelDecision[];
  chosen?: MediaUnderstandingModelDecision;
};

/** Shared type for Media Understanding Decision in src/media-understanding. */
export type MediaUnderstandingDecision = {
  capability: MediaUnderstandingCapability;
  outcome: MediaUnderstandingDecisionOutcome;
  attachments: MediaUnderstandingAttachmentDecision[];
};

type MediaUnderstandingProviderRequestAuthOverride =
  | { mode: "provider-default" }
  | { mode: "authorization-bearer"; token: string }
  | { mode: "header"; headerName: string; value: string; prefix?: string };

type MediaUnderstandingProviderRequestTlsOverride = {
  ca?: string;
  cert?: string;
  key?: string;
  passphrase?: string;
  serverName?: string;
  insecureSkipVerify?: boolean;
};

type MediaUnderstandingProviderRequestProxyOverride =
  | { mode: "env-proxy"; tls?: MediaUnderstandingProviderRequestTlsOverride }
  | { mode: "explicit-proxy"; url: string; tls?: MediaUnderstandingProviderRequestTlsOverride };

type MediaUnderstandingProviderRequestTransportOverrides = {
  headers?: Record<string, string>;
  auth?: MediaUnderstandingProviderRequestAuthOverride;
  proxy?: MediaUnderstandingProviderRequestProxyOverride;
  tls?: MediaUnderstandingProviderRequestTlsOverride;
  /** Runtime-only flag from trusted model-provider config; media config rejects it. */
  allowPrivateNetwork?: boolean;
};

/** Shared type for Audio Transcription Request in src/media-understanding. */
export type AudioTranscriptionRequest = {
  buffer: Buffer;
  fileName: string;
  mime?: string;
  apiKey: string;
  baseUrl?: string;
  headers?: Record<string, string>;
  request?: MediaUnderstandingProviderRequestTransportOverrides;
  model?: string;
  language?: string;
  prompt?: string;
  query?: Record<string, string | number | boolean>;
  timeoutMs: number;
  fetchFn?: typeof fetch;
};

/** Shared type for Audio Transcription Result in src/media-understanding. */
export type AudioTranscriptionResult = {
  text: string;
  model?: string;
};

/** Shared type for Video Description Request in src/media-understanding. */
export type VideoDescriptionRequest = {
  buffer: Buffer;
  fileName: string;
  mime?: string;
  apiKey: string;
  baseUrl?: string;
  headers?: Record<string, string>;
  request?: MediaUnderstandingProviderRequestTransportOverrides;
  model?: string;
  prompt?: string;
  timeoutMs: number;
  fetchFn?: typeof fetch;
};

/** Shared type for Video Description Result in src/media-understanding. */
export type VideoDescriptionResult = {
  text: string;
  model?: string;
};

/** Shared type for Image Description Request in src/media-understanding. */
export type ImageDescriptionRequest = {
  buffer: Buffer;
  fileName: string;
  mime?: string;
  prompt?: string;
  maxTokens?: number;
  timeoutMs: number;
  profile?: string;
  preferredProfile?: string;
  authStore?: AuthProfileStore;
  agentDir: string;
  workspaceDir?: string;
  cfg: OpenClawConfig;
  model: string;
  provider: string;
};

/** Shared type for Images Description Input in src/media-understanding. */
export type ImagesDescriptionInput = {
  buffer: Buffer;
  fileName: string;
  mime?: string;
};

/** Shared type for Images Description Request in src/media-understanding. */
export type ImagesDescriptionRequest = {
  images: ImagesDescriptionInput[];
  model: string;
  provider: string;
  prompt?: string;
  maxTokens?: number;
  timeoutMs: number;
  profile?: string;
  preferredProfile?: string;
  authStore?: AuthProfileStore;
  agentDir: string;
  workspaceDir?: string;
  cfg: OpenClawConfig;
};

/** Shared type for Image Description Result in src/media-understanding. */
export type ImageDescriptionResult = {
  text: string;
  model?: string;
};

/** Shared type for Images Description Result in src/media-understanding. */
export type ImagesDescriptionResult = {
  text: string;
  model?: string;
};

/** Shared type for Structured Extraction Text Input in src/media-understanding. */
export type StructuredExtractionTextInput = {
  type: "text";
  text: string;
};

/** Shared type for Structured Extraction Image Input in src/media-understanding. */
export type StructuredExtractionImageInput = {
  type: "image";
  buffer: Buffer;
  fileName: string;
  mime?: string;
};

/** Shared type for Structured Extraction Input in src/media-understanding. */
export type StructuredExtractionInput =
  | StructuredExtractionTextInput
  | StructuredExtractionImageInput;

/** Shared type for Structured Extraction Request in src/media-understanding. */
export type StructuredExtractionRequest = {
  /** Image-first extraction input; callers must include at least one image. */
  input: StructuredExtractionInput[];
  instructions: string;
  schemaName?: string;
  jsonSchema?: unknown;
  jsonMode?: boolean;
  timeoutMs: number;
  profile?: string;
  preferredProfile?: string;
  authStore?: AuthProfileStore;
  agentDir: string;
  cfg: OpenClawConfig;
  model: string;
  provider: string;
};

/** Shared type for Structured Extraction Result in src/media-understanding. */
export type StructuredExtractionResult = {
  text: string;
  parsed?: unknown;
  model?: string;
  provider?: string;
  contentType?: "json" | "text";
};

/** Shared type for Media Understanding Document Model Defaults in src/media-understanding. */
export type MediaUnderstandingDocumentModelDefaults = {
  textExtraction?: string;
  image?: string | false;
};

/** Shared type for Media Understanding Provider in src/media-understanding. */
export type MediaUnderstandingProvider = {
  id: string;
  capabilities?: MediaUnderstandingCapability[];
  defaultModels?: Partial<Record<MediaUnderstandingCapability, string>>;
  autoPriority?: Partial<Record<MediaUnderstandingCapability, number>>;
  nativeDocumentInputs?: Array<"pdf">;
  documentModels?: Partial<Record<"pdf", MediaUnderstandingDocumentModelDefaults>>;
  transcribeAudio?: (req: AudioTranscriptionRequest) => Promise<AudioTranscriptionResult>;
  describeVideo?: (req: VideoDescriptionRequest) => Promise<VideoDescriptionResult>;
  describeImage?: (req: ImageDescriptionRequest) => Promise<ImageDescriptionResult>;
  describeImages?: (req: ImagesDescriptionRequest) => Promise<ImagesDescriptionResult>;
  extractStructured?: (req: StructuredExtractionRequest) => Promise<StructuredExtractionResult>;
};
