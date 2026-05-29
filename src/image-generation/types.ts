import type { MediaNormalizationEntry } from "../../packages/media-generation-core/src/normalization.js";
import type { AuthProfileStore } from "../agents/auth-profiles/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { SsrFPolicy } from "../infra/net/ssrf.js";

/** Shared type for Generated Image Asset in src/image-generation. */
export type GeneratedImageAsset = {
  buffer: Buffer;
  mimeType: string;
  fileName?: string;
  revisedPrompt?: string;
  metadata?: Record<string, unknown>;
};

/** Shared type for Image Generation Resolution in src/image-generation. */
export type ImageGenerationResolution = "1K" | "2K" | "4K";

/** Shared type for Image Generation Quality in src/image-generation. */
export type ImageGenerationQuality = "low" | "medium" | "high" | "auto";

/** Shared type for Image Generation Output Format in src/image-generation. */
export type ImageGenerationOutputFormat = "png" | "jpeg" | "webp";

/** Shared type for Image Generation Background in src/image-generation. */
export type ImageGenerationBackground = "transparent" | "opaque" | "auto";

/** Shared type for Image Generation Open AIBackground in src/image-generation. */
export type ImageGenerationOpenAIBackground = ImageGenerationBackground;

/** Shared type for Image Generation Open AIModeration in src/image-generation. */
export type ImageGenerationOpenAIModeration = "low" | "auto";

/** Shared type for Image Generation Open AIOptions in src/image-generation. */
export type ImageGenerationOpenAIOptions = {
  background?: ImageGenerationOpenAIBackground;
  moderation?: ImageGenerationOpenAIModeration;
  outputCompression?: number;
  user?: string;
};

/** Shared type for Image Generation Provider Options in src/image-generation. */
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

/** Shared type for Image Generation Ignored Override in src/image-generation. */
export type ImageGenerationIgnoredOverride = {
  key: ImageGenerationIgnoredOverrideKey;
  value: string;
};

/** Shared type for Image Generation Source Image in src/image-generation. */
export type ImageGenerationSourceImage = {
  buffer: Buffer;
  mimeType: string;
  fileName?: string;
  metadata?: Record<string, unknown>;
};

/** Shared type for Image Generation Provider Configured Context in src/image-generation. */
export type ImageGenerationProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  agentDir?: string;
};

/** Shared type for Image Generation Request in src/image-generation. */
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

/** Shared type for Image Generation Result in src/image-generation. */
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

/** Shared type for Image Generation Normalization in src/image-generation. */
export type ImageGenerationNormalization = {
  size?: MediaNormalizationEntry<string>;
  aspectRatio?: MediaNormalizationEntry<string>;
  resolution?: MediaNormalizationEntry<ImageGenerationResolution>;
};

/** Shared type for Image Generation Provider Capabilities in src/image-generation. */
export type ImageGenerationProviderCapabilities = {
  generate: ImageGenerationModeCapabilities;
  edit: ImageGenerationEditCapabilities;
  geometry?: ImageGenerationGeometryCapabilities;
  output?: ImageGenerationOutputCapabilities;
};

/** Shared type for Image Generation Provider in src/image-generation. */
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
