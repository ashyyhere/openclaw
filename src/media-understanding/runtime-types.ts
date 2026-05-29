// Public runtime parameter/result contracts for media-understanding operations.
import type { AuthProfileStore } from "../agents/auth-profiles/types.js";
import type { OpenClawConfig } from "../config/types.js";
import type { ActiveMediaModel } from "./active-model.types.js";
import type {
  MediaUnderstandingDecision,
  MediaUnderstandingOutput,
  MediaUnderstandingProvider,
  StructuredExtractionInput,
} from "./types.js";

/** Generic file-based media-understanding request. */
export type RunMediaUnderstandingFileParams = {
  capability: "image" | "audio" | "video";
  filePath: string;
  mediaUrl?: string;
  cfg: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  mime?: string;
  activeModel?: ActiveMediaModel;
  prompt?: string;
  timeoutMs?: number;
};

/** Generic media-understanding result returned by runtime helpers. */
export type RunMediaUnderstandingFileResult = {
  text: string | undefined;
  provider?: string;
  model?: string;
  output?: MediaUnderstandingOutput;
  decision?: MediaUnderstandingDecision;
};

/** Image description request with optional active-model fallback. */
export type DescribeImageFileParams = {
  filePath: string;
  mediaUrl?: string;
  cfg: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  mime?: string;
  activeModel?: ActiveMediaModel;
  prompt?: string;
  timeoutMs?: number;
};

/** Image description request pinned to a specific provider/model. */
export type DescribeImageFileWithModelParams = {
  filePath: string;
  mediaUrl?: string;
  cfg: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  mime?: string;
  provider: string;
  model: string;
  prompt: string;
  maxTokens?: number;
  timeoutMs?: number;
};

type DescribeImageFileWithModelResult = Awaited<
  ReturnType<NonNullable<MediaUnderstandingProvider["describeImage"]>>
>;

/** Structured extraction request pinned to a provider/model and schema settings. */
export type ExtractStructuredWithModelParams = {
  /** At least one image input is required; text inputs provide supplemental context. */
  input: StructuredExtractionInput[];
  instructions: string;
  schemaName?: string;
  jsonSchema?: unknown;
  jsonMode?: boolean;
  cfg: OpenClawConfig;
  agentDir?: string;
  provider: string;
  model: string;
  profile?: string;
  preferredProfile?: string;
  authStore?: AuthProfileStore;
  timeoutMs?: number;
};

type ExtractStructuredWithModelResult = Awaited<
  ReturnType<NonNullable<MediaUnderstandingProvider["extractStructured"]>>
>;

/** Video description request with optional active-model fallback. */
export type DescribeVideoFileParams = {
  filePath: string;
  cfg: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  mime?: string;
  activeModel?: ActiveMediaModel;
};

/** Audio transcription request with optional active-model fallback. */
export type TranscribeAudioFileParams = {
  filePath: string;
  cfg: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  mime?: string;
  activeModel?: ActiveMediaModel;
  language?: string;
  prompt?: string;
};

/** Runtime facade for media-understanding file/model operations. */
export type MediaUnderstandingRuntime = {
  runMediaUnderstandingFile: (
    params: RunMediaUnderstandingFileParams,
  ) => Promise<RunMediaUnderstandingFileResult>;
  describeImageFile: (params: DescribeImageFileParams) => Promise<RunMediaUnderstandingFileResult>;
  describeImageFileWithModel: (
    params: DescribeImageFileWithModelParams,
  ) => Promise<DescribeImageFileWithModelResult>;
  extractStructuredWithModel: (
    params: ExtractStructuredWithModelParams,
  ) => Promise<ExtractStructuredWithModelResult>;
  describeVideoFile: (params: DescribeVideoFileParams) => Promise<RunMediaUnderstandingFileResult>;
  transcribeAudioFile: (
    params: TranscribeAudioFileParams,
  ) => Promise<RunMediaUnderstandingFileResult>;
};
