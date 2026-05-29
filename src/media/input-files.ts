// media input files helpers and runtime behavior.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { fetchWithSsrFGuard } from "../infra/net/fetch-guard.js";
import type { SsrFPolicy } from "../infra/net/ssrf.js";
import { logWarn } from "../logger.js";
import {
  normalizeOptionalLowercaseString,
  normalizeOptionalString,
} from "../shared/string-coerce.js";
import { canonicalizeBase64, estimateBase64DecodedBytes } from "./base64.js";
import { parseMediaContentLength } from "./content-length.js";
import { convertHeicToJpeg } from "./media-services.js";
import { detectMime } from "./mime.js";
import { extractPdfContent, type PdfExtractedImage } from "./pdf-extract.js";
import { readResponseWithLimit } from "./read-response-with-limit.js";

/** Shared type for Input Image Content in src/media. */
export type InputImageContent = PdfExtractedImage;

/** Shared type for Input File Extract Result in src/media. */
export type InputFileExtractResult = {
  filename: string;
  text?: string;
  images?: InputImageContent[];
};

/** Shared type for Input Pdf Limits in src/media. */
export type InputPdfLimits = {
  maxPages: number;
  maxPixels: number;
  minTextChars: number;
};

/** Shared type for Input File Limits in src/media. */
export type InputFileLimits = {
  allowUrl: boolean;
  urlAllowlist?: string[];
  allowedMimes: Set<string>;
  maxBytes: number;
  maxChars: number;
  maxRedirects: number;
  timeoutMs: number;
  pdf: InputPdfLimits;
};

/** Shared type for Input File Limits Config in src/media. */
export type InputFileLimitsConfig = {
  allowUrl?: boolean;
  allowedMimes?: string[];
  maxBytes?: number;
  maxChars?: number;
  maxRedirects?: number;
  timeoutMs?: number;
  pdf?: {
    maxPages?: number;
    maxPixels?: number;
    minTextChars?: number;
  };
};

/** Shared type for Input Image Limits in src/media. */
export type InputImageLimits = {
  allowUrl: boolean;
  urlAllowlist?: string[];
  allowedMimes: Set<string>;
  maxBytes: number;
  maxRedirects: number;
  timeoutMs: number;
};

/** Shared type for Input Image Source in src/media. */
export type InputImageSource =
  | {
      type: "base64";
      data: string;
      mediaType?: string;
    }
  | {
      type: "url";
      url: string;
      mediaType?: string;
    };

/** Shared type for Input File Source in src/media. */
export type InputFileSource =
  | {
      type: "base64";
      data: string;
      mediaType?: string;
      filename?: string;
    }
  | {
      type: "url";
      url: string;
      mediaType?: string;
      filename?: string;
    };

/** Shared type for Input Fetch Result in src/media. */
export type InputFetchResult = {
  buffer: Buffer;
  mimeType: string;
  contentType?: string;
};

/** Reused constant for DEFAULT INPUT IMAGE MIMES behavior in src/media. */
export const DEFAULT_INPUT_IMAGE_MIMES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/heif",
];
/** Reused constant for DEFAULT INPUT FILE MIMES behavior in src/media. */
export const DEFAULT_INPUT_FILE_MIMES = [
  "text/plain",
  "text/markdown",
  "text/html",
  "text/csv",
  "application/json",
  "application/pdf",
];
/** Reused constant for DEFAULT INPUT IMAGE MAX BYTES behavior in src/media. */
export const DEFAULT_INPUT_IMAGE_MAX_BYTES = 10 * 1024 * 1024;
/** Reused constant for DEFAULT INPUT FILE MAX BYTES behavior in src/media. */
export const DEFAULT_INPUT_FILE_MAX_BYTES = 5 * 1024 * 1024;
/** Reused constant for DEFAULT INPUT FILE MAX CHARS behavior in src/media. */
export const DEFAULT_INPUT_FILE_MAX_CHARS = 60_000;
/** Reused constant for DEFAULT INPUT MAX REDIRECTS behavior in src/media. */
export const DEFAULT_INPUT_MAX_REDIRECTS = 3;
/** Reused constant for DEFAULT INPUT TIMEOUT MS behavior in src/media. */
export const DEFAULT_INPUT_TIMEOUT_MS = 10_000;
/** Reused constant for DEFAULT INPUT PDF MAX PAGES behavior in src/media. */
export const DEFAULT_INPUT_PDF_MAX_PAGES = 4;
/** Reused constant for DEFAULT INPUT PDF MAX PIXELS behavior in src/media. */
export const DEFAULT_INPUT_PDF_MAX_PIXELS = 4_000_000;
/** Reused constant for DEFAULT INPUT PDF MIN TEXT CHARS behavior in src/media. */
export const DEFAULT_INPUT_PDF_MIN_TEXT_CHARS = 200;
const NORMALIZED_INPUT_IMAGE_MIME = "image/jpeg";
const HEIC_INPUT_IMAGE_MIMES = new Set(["image/heic", "image/heif"]);

function rejectOversizedBase64Payload(params: {
  data: string;
  maxBytes: number;
  label: "Image" | "File";
}): void {
  const estimated = estimateBase64DecodedBytes(params.data);
  if (estimated > params.maxBytes) {
    throw new Error(
      `${params.label} too large: ${estimated} bytes (limit: ${params.maxBytes} bytes)`,
    );
  }
}

/** Reused helper for normalize Mime Type behavior in src/media. */
export function normalizeMimeType(value: string | undefined): string | undefined {
  const [raw] = value?.split(";") ?? [];
  return normalizeOptionalLowercaseString(raw);
}

/** Reused helper for parse Content Type behavior in src/media. */
export function parseContentType(value: string | undefined): {
  mimeType?: string;
  charset?: string;
} {
  if (!value) {
    return {};
  }
  const parts = value.split(";").map((part) => part.trim());
  const mimeType = normalizeMimeType(parts[0]);
  const charset = parts
    .map((part) => normalizeOptionalString(part.match(/^charset=(.+)$/i)?.[1]))
    .find((part) => part && part.length > 0);
  return { mimeType, charset };
}

/** Reused helper for normalize Mime List behavior in src/media. */
export function normalizeMimeList(values: string[] | undefined, fallback: string[]): Set<string> {
  const input = values && values.length > 0 ? values : fallback;
  return new Set(input.flatMap((value) => normalizeMimeType(value) ?? []));
}

/** Reused helper for resolve Input File Limits behavior in src/media. */
export function resolveInputFileLimits(config?: InputFileLimitsConfig): InputFileLimits {
  return {
    allowUrl: config?.allowUrl ?? true,
    allowedMimes: normalizeMimeList(config?.allowedMimes, DEFAULT_INPUT_FILE_MIMES),
    maxBytes: config?.maxBytes ?? DEFAULT_INPUT_FILE_MAX_BYTES,
    maxChars: config?.maxChars ?? DEFAULT_INPUT_FILE_MAX_CHARS,
    maxRedirects: config?.maxRedirects ?? DEFAULT_INPUT_MAX_REDIRECTS,
    timeoutMs: config?.timeoutMs ?? DEFAULT_INPUT_TIMEOUT_MS,
    pdf: {
      maxPages: config?.pdf?.maxPages ?? DEFAULT_INPUT_PDF_MAX_PAGES,
      maxPixels: config?.pdf?.maxPixels ?? DEFAULT_INPUT_PDF_MAX_PIXELS,
      minTextChars: config?.pdf?.minTextChars ?? DEFAULT_INPUT_PDF_MIN_TEXT_CHARS,
    },
  };
}

/** Reused helper for fetch With Guard behavior in src/media. */
export async function fetchWithGuard(params: {
  url: string;
  maxBytes: number;
  timeoutMs: number;
  maxRedirects: number;
  policy?: SsrFPolicy;
  auditContext?: string;
}): Promise<InputFetchResult> {
  const { response, release } = await fetchWithSsrFGuard({
    url: params.url,
    maxRedirects: params.maxRedirects,
    timeoutMs: params.timeoutMs,
    policy: params.policy,
    auditContext: params.auditContext,
    init: { headers: { "User-Agent": "OpenClaw-Gateway/1.0" } },
  });

  try {
    if (!response.ok) {
      await discardIgnoredResponseBody(response);
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    let contentLength: number | null;
    try {
      contentLength = parseMediaContentLength(response.headers.get("content-length"));
    } catch (err) {
      await discardIgnoredResponseBody(response);
      throw err;
    }
    if (contentLength !== null && contentLength > params.maxBytes) {
      await discardIgnoredResponseBody(response);
      throw new Error(
        `Content too large: ${contentLength} bytes (limit: ${params.maxBytes} bytes)`,
      );
    }

    const buffer = await readResponseWithLimit(response, params.maxBytes);

    const contentType = response.headers.get("content-type") || undefined;
    const parsed = parseContentType(contentType);
    const mimeType = parsed.mimeType ?? "application/octet-stream";
    return { buffer, mimeType, contentType };
  } finally {
    await release();
  }
}

async function discardIgnoredResponseBody(response: Response): Promise<void> {
  const body = response.body;
  if (!body) {
    return;
  }
  try {
    await body.cancel();
  } catch {
    // Best-effort cleanup after rejecting a response body.
  }
}

function decodeTextContent(buffer: Buffer, charset: string | undefined): string {
  const encoding = normalizeOptionalLowercaseString(charset) || "utf-8";
  try {
    return new TextDecoder(encoding).decode(buffer);
  } catch {
    return new TextDecoder("utf-8").decode(buffer);
  }
}

function clampText(text: string, maxChars: number): string {
  if (text.length <= maxChars) {
    return text;
  }
  return text.slice(0, maxChars);
}

async function normalizeInputImage(params: {
  buffer: Buffer;
  mimeType?: string;
  limits: InputImageLimits;
}): Promise<InputImageContent> {
  const declaredMime = normalizeMimeType(params.mimeType) ?? "application/octet-stream";
  const detectedMime = normalizeMimeType(
    await detectMime({ buffer: params.buffer, headerMime: params.mimeType }),
  );
  if (declaredMime.startsWith("image/") && detectedMime && !detectedMime.startsWith("image/")) {
    throw new Error(`Unsupported image MIME type: ${detectedMime}`);
  }
  const sourceMime =
    (detectedMime && HEIC_INPUT_IMAGE_MIMES.has(detectedMime)) ||
    (HEIC_INPUT_IMAGE_MIMES.has(declaredMime) && !detectedMime)
      ? (detectedMime ?? declaredMime)
      : declaredMime;
  if (!params.limits.allowedMimes.has(sourceMime)) {
    throw new Error(`Unsupported image MIME type: ${sourceMime}`);
  }

  if (!HEIC_INPUT_IMAGE_MIMES.has(sourceMime)) {
    return {
      type: "image",
      data: params.buffer.toString("base64"),
      mimeType: sourceMime,
    };
  }

  const normalizedBuffer = await convertHeicToJpeg(params.buffer);
  if (normalizedBuffer.byteLength > params.limits.maxBytes) {
    throw new Error(
      `Image too large after HEIC conversion: ${normalizedBuffer.byteLength} bytes (limit: ${params.limits.maxBytes} bytes)`,
    );
  }
  return {
    type: "image",
    data: normalizedBuffer.toString("base64"),
    mimeType: NORMALIZED_INPUT_IMAGE_MIME,
  };
}

async function resolveInputFileMime(params: {
  buffer: Buffer;
  declaredMime?: string;
}): Promise<string | undefined> {
  const sniffedMime = normalizeMimeType(await detectMime({ buffer: params.buffer }));
  if (!sniffedMime) {
    return params.declaredMime;
  }
  if (sniffedMime === "application/octet-stream") {
    return params.declaredMime ?? sniffedMime;
  }
  return sniffedMime;
}

/** Reused helper for extract Image Content From Source behavior in src/media. */
export async function extractImageContentFromSource(
  source: InputImageSource,
  limits: InputImageLimits,
): Promise<InputImageContent> {
  if (source.type === "base64") {
    rejectOversizedBase64Payload({ data: source.data, maxBytes: limits.maxBytes, label: "Image" });
    const canonicalData = canonicalizeBase64(source.data);
    if (!canonicalData) {
      throw new Error("input_image base64 source has invalid 'data' field");
    }
    const buffer = Buffer.from(canonicalData, "base64");
    if (buffer.byteLength > limits.maxBytes) {
      throw new Error(
        `Image too large: ${buffer.byteLength} bytes (limit: ${limits.maxBytes} bytes)`,
      );
    }
    return await normalizeInputImage({
      buffer,
      mimeType: normalizeMimeType(source.mediaType) ?? "image/png",
      limits,
    });
  }

  if (source.type === "url") {
    if (!limits.allowUrl) {
      throw new Error("input_image URL sources are disabled by config");
    }
    const result = await fetchWithGuard({
      url: source.url,
      maxBytes: limits.maxBytes,
      timeoutMs: limits.timeoutMs,
      maxRedirects: limits.maxRedirects,
      policy: {
        allowPrivateNetwork: false,
        hostnameAllowlist: limits.urlAllowlist,
      },
      auditContext: "openresponses.input_image",
    });
    return await normalizeInputImage({
      buffer: result.buffer,
      mimeType: result.mimeType,
      limits,
    });
  }

  throw new Error(`Unsupported input_image source type: ${(source as { type: string }).type}`);
}

/** Reused helper for extract File Content From Source behavior in src/media. */
export async function extractFileContentFromSource(params: {
  source: InputFileSource;
  limits: InputFileLimits;
  config?: OpenClawConfig;
}): Promise<InputFileExtractResult> {
  const { source, limits } = params;
  const filename = source.filename || "file";

  let buffer: Buffer;
  let mimeType: string | undefined;
  let charset: string | undefined;

  if (source.type === "base64") {
    rejectOversizedBase64Payload({ data: source.data, maxBytes: limits.maxBytes, label: "File" });
    const canonicalData = canonicalizeBase64(source.data);
    if (!canonicalData) {
      throw new Error("input_file base64 source has invalid 'data' field");
    }
    const parsed = parseContentType(source.mediaType);
    mimeType = parsed.mimeType;
    charset = parsed.charset;
    buffer = Buffer.from(canonicalData, "base64");
  } else {
    if (!limits.allowUrl) {
      throw new Error("input_file URL sources are disabled by config");
    }
    const result = await fetchWithGuard({
      url: source.url,
      maxBytes: limits.maxBytes,
      timeoutMs: limits.timeoutMs,
      maxRedirects: limits.maxRedirects,
      policy: {
        allowPrivateNetwork: false,
        hostnameAllowlist: limits.urlAllowlist,
      },
      auditContext: "openresponses.input_file",
    });
    const parsed = parseContentType(result.contentType);
    mimeType = parsed.mimeType ?? normalizeMimeType(result.mimeType);
    charset = parsed.charset;
    buffer = result.buffer;
  }

  if (buffer.byteLength > limits.maxBytes) {
    throw new Error(`File too large: ${buffer.byteLength} bytes (limit: ${limits.maxBytes} bytes)`);
  }

  mimeType = await resolveInputFileMime({ buffer, declaredMime: mimeType });

  if (!mimeType) {
    throw new Error("input_file missing media type");
  }
  if (!limits.allowedMimes.has(mimeType)) {
    throw new Error(`Unsupported file MIME type: ${mimeType}`);
  }

  if (mimeType === "application/pdf") {
    const extracted = await extractPdfContent({
      buffer,
      maxPages: limits.pdf.maxPages,
      maxPixels: limits.pdf.maxPixels,
      minTextChars: limits.pdf.minTextChars,
      ...(params.config ? { config: params.config } : {}),
      onImageExtractionError: (err) => {
        logWarn(`media: PDF image extraction skipped, ${String(err)}`);
      },
    });
    const text = extracted.text ? clampText(extracted.text, limits.maxChars) : "";
    return {
      filename,
      text,
      images: extracted.images.length > 0 ? extracted.images : undefined,
    };
  }

  const text = clampText(decodeTextContent(buffer, charset), limits.maxChars);
  return { filename, text };
}
