import type { MediaNormalizationEntry } from "../../packages/media-generation-core/src/normalization.js";
import type { AuthProfileStore } from "../agents/auth-profiles/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { SsrFPolicy } from "../infra/net/ssrf.js";

/** Generated image bytes plus MIME, filename, prompt, and provider metadata. */
export type GeneratedImageAsset = {
  buffer: Buffer;
  mimeType: string;
  fileName?: string;
  revisedPrompt?: string;
  metadata?: Record<string, unknown>;
};

/** Provider-neutral image resolution selector. */
export type ImageGenerationResolution = "1K" | "2K" | "4K";

/** Provider-neutral image quality selector. */
export type ImageGenerationQuality = "low" | "medium" | "high" | "auto";

/** Supported output file formats for generated images. */
export type ImageGenerationOutputFormat = "png" | "jpeg" | "webp";

/** Background handling requested from providers that support it. */
export type ImageGenerationBackground = "transparent" | "opaque" | "auto";

/** OpenAI-compatible background option alias. */
export type ImageGenerationOpenAIBackground = ImageGenerationBackground;

/** OpenAI-compatible moderation selector. */
export type ImageGenerationOpenAIModeration = "low" | "auto";

/** OpenAI-compatible provider-specific request options. */
export type ImageGenerationOpenAIOptions = {
  background?: ImageGenerationOpenAIBackground;
  moderation?: ImageGenerationOpenAIModeration;
  outputCompression?: number;
  user?: string;
};

/** Provider-specific image generation options grouped by provider family. */
export type ImageGenerationProviderOptions = Record<string, unknown> & {
  openai?: ImageGenerationOpenAIOptions;
};

type ImageGenerationIgnoredOverrideKey =
  | "size"
  | "aspectRatio"
  | "resolution"
  | "quality"
  | "outputFormat"
  | "background";

/** Requested override that was ignored because a provider or mode does not support it. */
export type ImageGenerationIgnoredOverride = {
  key: ImageGenerationIgnoredOverrideKey;
  value: string;
};

/** Input/reference image passed to an edit-capable image provider. */
export type ImageGenerationSourceImage = {
  buffer: Buffer;
  mimeType: string;
  fileName?: string;
  metadata?: Record<string, unknown>;
};

/** Context used by providers to decide whether required auth/config is present. */
export type ImageGenerationProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  agentDir?: string;
};

/** Fully resolved request passed into an image-generation provider implementation. */
export type ImageGenerationRequest = {
  provider: string;
  model: string;
  prompt: string;
  cfg: OpenClawConfig;
  agentDir?: string;
  authStore?: AuthProfileStore;
  timeoutMs?: number;
  count?: number;
  size?: string;
  aspectRatio?: string;
  resolution?: ImageGenerationResolution;
  quality?: ImageGenerationQuality;
  outputFormat?: ImageGenerationOutputFormat;
  background?: ImageGenerationBackground;
  inputImages?: ImageGenerationSourceImage[];
  providerOptions?: ImageGenerationProviderOptions;
  ssrfPolicy?: SsrFPolicy;
};

/** Provider result containing generated images and optional response metadata. */
export type ImageGenerationResult = {
  images: GeneratedImageAsset[];
  model?: string;
  metadata?: Record<string, unknown>;
};

type ImageGenerationModeCapabilities = {
  maxCount?: number;
  supportsSize?: boolean;
  supportsAspectRatio?: boolean;
  supportsResolution?: boolean;
};

type ImageGenerationEditCapabilities = ImageGenerationModeCapabilities & {
  enabled: boolean;
  maxInputImages?: number;
};

type ImageGenerationGeometryCapabilities = {
  sizes?: string[];
  sizesByModel?: Record<string, string[]>;
  aspectRatios?: string[];
  aspectRatiosByModel?: Record<string, string[]>;
  resolutions?: ImageGenerationResolution[];
  resolutionsByModel?: Record<string, ImageGenerationResolution[]>;
};

type ImageGenerationOutputCapabilities = {
  qualities?: ImageGenerationQuality[];
  formats?: ImageGenerationOutputFormat[];
  backgrounds?: ImageGenerationBackground[];
};

/** Normalization metadata for size/aspect/resolution overrides. */
export type ImageGenerationNormalization = {
  size?: MediaNormalizationEntry<string>;
  aspectRatio?: MediaNormalizationEntry<string>;
  resolution?: MediaNormalizationEntry<ImageGenerationResolution>;
};

/** Capability declaration used to normalize overrides and choose generation/edit mode. */
export type ImageGenerationProviderCapabilities = {
  generate: ImageGenerationModeCapabilities;
  edit: ImageGenerationEditCapabilities;
  geometry?: ImageGenerationGeometryCapabilities;
  output?: ImageGenerationOutputCapabilities;
};

/** Plugin capability surface for image generation providers. */
export type ImageGenerationProvider = {
  id: string;
  aliases?: string[];
  label?: string;
  defaultModel?: string;
  /** Default provider operation timeout in milliseconds when caller/config omit timeoutMs. */
  defaultTimeoutMs?: number;
  models?: string[];
  capabilities: ImageGenerationProviderCapabilities;
  isConfigured?: (ctx: ImageGenerationProviderConfiguredContext) => boolean;
  generateImage: (req: ImageGenerationRequest) => Promise<ImageGenerationResult>;
};
