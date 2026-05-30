// Provider-facing contracts for describing, transcribing, and extracting
// structured data from media attachments.
import type { AuthProfileStore } from "../agents/auth-profiles/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";

type MediaUnderstandingKind = "audio.transcription" | "video.description" | "image.description";

/** Capability family a media understanding provider can satisfy. */
export type MediaUnderstandingCapability = "image" | "audio" | "video";

/** Registry of provider ids to the media capabilities they advertise. */
export type MediaUnderstandingCapabilityRegistry = Map<
  string,
  {
    capabilities?: MediaUnderstandingCapability[];
  }
>;

/** Normalized attachment metadata passed into media-understanding selection. */
export type MediaAttachment = {
  path?: string;
  url?: string;
  mime?: string;
  index: number;
  alreadyTranscribed?: boolean;
};

/** Text output produced for a single attachment by a chosen provider/model. */
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

/** Attempt record for a provider or CLI model considered during selection. */
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

/** Aggregate selection result for one capability across candidate attachments. */
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

/** Binary audio transcription request sent to a media provider adapter. */
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

/** Text transcript returned by an audio provider adapter. */
export type AudioTranscriptionResult = {
  text: string;
  model?: string;
};

/** Binary video description request sent to a media provider adapter. */
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

/** Natural-language video description returned by a provider adapter. */
export type VideoDescriptionResult = {
  text: string;
  model?: string;
};

/** Single-image description request with agent auth/config context attached. */
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

/** One image payload inside a batched image description request. */
export type ImagesDescriptionInput = {
  buffer: Buffer;
  fileName: string;
  mime?: string;
};

/** Batched image description request for providers that accept multiple images. */
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

/** Description result for a single-image request. */
export type ImageDescriptionResult = {
  text: string;
  model?: string;
};

/** Description result for a batched image request. */
export type ImagesDescriptionResult = {
  text: string;
  model?: string;
};

/** Text-only input item for structured extraction prompts. */
export type StructuredExtractionTextInput = {
  type: "text";
  text: string;
};

/** Image input item for structured extraction prompts. */
export type StructuredExtractionImageInput = {
  type: "image";
  buffer: Buffer;
  fileName: string;
  mime?: string;
};

/** Supported multimodal inputs for structured extraction. */
export type StructuredExtractionInput =
  | StructuredExtractionTextInput
  | StructuredExtractionImageInput;

/** Structured extraction request with optional schema and JSON-mode hints. */
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

/** Text or parsed structured extraction payload returned by a provider. */
export type StructuredExtractionResult = {
  text: string;
  parsed?: unknown;
  model?: string;
  provider?: string;
  contentType?: "json" | "text";
};

/** Default models a provider prefers for native document understanding. */
export type MediaUnderstandingDocumentModelDefaults = {
  textExtraction?: string;
  image?: string | false;
};

/** Provider adapter contract for media understanding capability handlers. */
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
