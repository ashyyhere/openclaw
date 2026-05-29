// image-generation image assets helpers and runtime behavior.
import { canonicalizeBase64 } from "../media/base64.js";
import { isRecord } from "../shared/record-coerce.js";
import {
  normalizeOptionalLowercaseString,
  normalizeOptionalString,
} from "../shared/string-coerce.js";
import type { GeneratedImageAsset, ImageGenerationSourceImage } from "./types.js";

const DEFAULT_IMAGE_MIME_TYPE = "image/png";
const DEFAULT_IMAGE_FILE_PREFIX = "image";

/** Shared type for Image Mime Type Detection in src/image-generation. */
export type ImageMimeTypeDetection = {
  mimeType: string;
  extension: string;
};

/** Shared type for Open Ai Compatible Image Response Entry in src/image-generation. */
export type OpenAiCompatibleImageResponseEntry = {
  b64_json?: unknown;
  mime_type?: unknown;
  revised_prompt?: unknown;
};

/** Shared type for Open Ai Compatible Image Response Payload in src/image-generation. */
export type OpenAiCompatibleImageResponsePayload = {
  data?: unknown;
};

function throwMalformedImageResponse(message: string | undefined): never | undefined {
  if (message) {
    throw new Error(message);
  }
  return undefined;
}

/** Reused helper for image File Extension For Mime Type behavior in src/image-generation. */
export function imageFileExtensionForMimeType(
  mimeType: string | undefined,
  fallback = "png",
): string {
  const normalized = normalizeOptionalLowercaseString(mimeType)?.split(";")[0]?.trim();
  if (!normalized) {
    return fallback;
  }
  if (normalized.includes("jpeg") || normalized.includes("jpg")) {
    return "jpg";
  }
  if (normalized.includes("svg")) {
    return "svg";
  }
  const slashIndex = normalized.indexOf("/");
  return slashIndex >= 0 ? normalized.slice(slashIndex + 1) || fallback : fallback;
}

/** Reused helper for sniff Image Mime Type behavior in src/image-generation. */
export function sniffImageMimeType(
  buffer: Buffer,
  fallbackMimeType = DEFAULT_IMAGE_MIME_TYPE,
): ImageMimeTypeDetection {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mimeType: "image/jpeg", extension: "jpg" };
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { mimeType: "image/png", extension: "png" };
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return { mimeType: "image/webp", extension: "webp" };
  }
  return {
    mimeType: fallbackMimeType,
    extension: imageFileExtensionForMimeType(fallbackMimeType),
  };
}

/** Reused helper for to Image Data Url behavior in src/image-generation. */
export function toImageDataUrl(params: {
  buffer: Buffer;
  mimeType?: string;
  defaultMimeType?: string;
}): string {
  const mimeType =
    normalizeOptionalString(params.mimeType) ??
    normalizeOptionalString(params.defaultMimeType) ??
    DEFAULT_IMAGE_MIME_TYPE;
  return `data:${mimeType};base64,${params.buffer.toString("base64")}`;
}

/** Reused helper for parse Image Data Url behavior in src/image-generation. */
export function parseImageDataUrl(
  dataUrl: string,
): { mimeType: string; base64: string } | undefined {
  const match = dataUrl.match(/^data:(image\/[^;,]+)(?:;[^,]*)?;base64,(.+)$/is);
  if (!match) {
    return undefined;
  }
  const mimeType = normalizeOptionalString(match[1]);
  const base64 = normalizeOptionalString(match[2]);
  if (!mimeType || !base64) {
    return undefined;
  }
  const canonicalBase64 = canonicalizeBase64(base64);
  if (!canonicalBase64) {
    return undefined;
  }
  return { mimeType, base64: canonicalBase64 };
}

/** Reused helper for generated Image Asset From Base64 behavior in src/image-generation. */
export function generatedImageAssetFromBase64(params: {
  base64: string | undefined;
  index: number;
  mimeType?: string;
  revisedPrompt?: string;
  defaultMimeType?: string;
  fileNamePrefix?: string;
  sniffMimeType?: boolean;
}): GeneratedImageAsset | undefined {
  const base64 = normalizeOptionalString(params.base64);
  const canonicalBase64 = base64 ? canonicalizeBase64(base64) : undefined;
  if (!canonicalBase64) {
    return undefined;
  }
  const buffer = Buffer.from(canonicalBase64, "base64");
  const explicitMimeType = normalizeOptionalString(params.mimeType);
  const defaultMimeType =
    normalizeOptionalString(params.defaultMimeType) ?? DEFAULT_IMAGE_MIME_TYPE;
  const detected =
    params.sniffMimeType && !explicitMimeType
      ? sniffImageMimeType(buffer, defaultMimeType)
      : undefined;
  const mimeType = explicitMimeType ?? detected?.mimeType ?? defaultMimeType;
  const prefix = normalizeOptionalString(params.fileNamePrefix) ?? DEFAULT_IMAGE_FILE_PREFIX;
  const image: GeneratedImageAsset = {
    buffer,
    mimeType,
    fileName: `${prefix}-${params.index + 1}.${detected?.extension ?? imageFileExtensionForMimeType(mimeType)}`,
  };
  const revisedPrompt = normalizeOptionalString(params.revisedPrompt);
  if (revisedPrompt) {
    image.revisedPrompt = revisedPrompt;
  }
  return image;
}

/** Reused helper for generated Image Asset From Data Url behavior in src/image-generation. */
export function generatedImageAssetFromDataUrl(params: {
  dataUrl: string;
  index: number;
  fileNamePrefix?: string;
}): GeneratedImageAsset | undefined {
  const parsed = parseImageDataUrl(params.dataUrl);
  if (!parsed) {
    return undefined;
  }
  return generatedImageAssetFromBase64({
    base64: parsed.base64,
    index: params.index,
    mimeType: parsed.mimeType,
    fileNamePrefix: params.fileNamePrefix,
  });
}

/** Reused helper for generated Image Asset From Open Ai Compatible Entry behavior in src/image-generation. */
export function generatedImageAssetFromOpenAiCompatibleEntry(
  entry: OpenAiCompatibleImageResponseEntry,
  index: number,
  options: {
    defaultMimeType?: string;
    fileNamePrefix?: string;
    sniffMimeType?: boolean;
  } = {},
): GeneratedImageAsset | undefined {
  return generatedImageAssetFromBase64({
    base64: normalizeOptionalString(entry.b64_json),
    index,
    mimeType: normalizeOptionalString(entry.mime_type),
    revisedPrompt: normalizeOptionalString(entry.revised_prompt),
    defaultMimeType: options.defaultMimeType,
    fileNamePrefix: options.fileNamePrefix,
    sniffMimeType: options.sniffMimeType,
  });
}

/** Reused helper for parse Open Ai Compatible Image Response behavior in src/image-generation. */
export function parseOpenAiCompatibleImageResponse(
  payload: unknown,
  options: {
    defaultMimeType?: string;
    fileNamePrefix?: string;
    malformedResponseError?: string;
    sniffMimeType?: boolean;
  } = {},
): GeneratedImageAsset[] {
  if (!isRecord(payload)) {
    throwMalformedImageResponse(options.malformedResponseError);
    return [];
  }
  const data = payload.data;
  if (data === undefined || data === null) {
    return [];
  }
  if (!Array.isArray(data)) {
    throwMalformedImageResponse(options.malformedResponseError);
    return [];
  }

  const images: GeneratedImageAsset[] = [];
  for (const [index, entry] of data.entries()) {
    if (!isRecord(entry)) {
      throwMalformedImageResponse(options.malformedResponseError);
      continue;
    }
    const image = generatedImageAssetFromOpenAiCompatibleEntry(entry, index, options);
    if (!image) {
      throwMalformedImageResponse(options.malformedResponseError);
      continue;
    }
    images.push(image);
  }
  return images;
}

/** Reused helper for image Source Upload File Name behavior in src/image-generation. */
export function imageSourceUploadFileName(params: {
  image: ImageGenerationSourceImage;
  index: number;
  defaultMimeType?: string;
  fileNamePrefix?: string;
}): string {
  const fileName = normalizeOptionalString(params.image.fileName);
  if (fileName) {
    return fileName;
  }
  const mimeType =
    normalizeOptionalString(params.image.mimeType) ??
    normalizeOptionalString(params.defaultMimeType) ??
    DEFAULT_IMAGE_MIME_TYPE;
  const prefix = normalizeOptionalString(params.fileNamePrefix) ?? DEFAULT_IMAGE_FILE_PREFIX;
  return `${prefix}-${params.index + 1}.${imageFileExtensionForMimeType(mimeType)}`;
}
