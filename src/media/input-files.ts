// Normalizes model input images/files from base64 or guarded URLs with size, MIME, and PDF limits.
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

/** Image content shape passed onward after extraction or PDF rendering. */
export type InputImageContent = PdfExtractedImage;

/** Extracted text/images plus the filename associated with an input file. */
export type InputFileExtractResult = {
  filename: string;
  text?: string;
  images?: InputImageContent[];
};

/** Limits used when extracting images/text from PDFs. */
export type InputPdfLimits = {
  maxPages: number;
  maxPixels: number;
  minTextChars: number;
};

/** Resolved file input limits after applying config defaults. */
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

/** Optional config values for resolving file input limits. */
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

/** Resolved image input limits after applying config defaults. */
export type InputImageLimits = {
  allowUrl: boolean;
  urlAllowlist?: string[];
  allowedMimes: Set<string>;
  maxBytes: number;
  maxRedirects: number;
  timeoutMs: number;
};

/** Image input source accepted by model request preprocessing. */
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

/** File input source accepted by model request preprocessing. */
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

/** Guarded URL fetch result with bytes and content-type metadata. */
export type InputFetchResult = {
  buffer: Buffer;
  mimeType: string;
  contentType?: string;
};

/** Default MIME allowlist for image inputs. */
export const DEFAULT_INPUT_IMAGE_MIMES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/heif",
];
/** Default MIME allowlist for file inputs. */
export const DEFAULT_INPUT_FILE_MIMES = [
  "text/plain",
  "text/markdown",
  "text/html",
  "text/csv",
  "application/json",
  "application/pdf",
];
/** Default max bytes for one image input. */
export const DEFAULT_INPUT_IMAGE_MAX_BYTES = 10 * 1024 * 1024;
/** Default max bytes for one file input. */
export const DEFAULT_INPUT_FILE_MAX_BYTES = 5 * 1024 * 1024;
/** Default max text characters retained from one extracted file. */
export const DEFAULT_INPUT_FILE_MAX_CHARS = 60_000;
/** Default redirect limit for input URL fetches. */
export const DEFAULT_INPUT_MAX_REDIRECTS = 3;
/** Default timeout for input URL fetches. */
export const DEFAULT_INPUT_TIMEOUT_MS = 10_000;
/** Default maximum PDF pages to inspect. */
export const DEFAULT_INPUT_PDF_MAX_PAGES = 4;
/** Default maximum pixels rendered per extracted PDF image. */
export const DEFAULT_INPUT_PDF_MAX_PIXELS = 4_000_000;
/** Default minimum PDF text threshold before image extraction is needed. */
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

/** Normalizes a MIME type by stripping parameters and lowercasing it. */
export function normalizeMimeType(value: string | undefined): string | undefined {
  const [raw] = value?.split(";") ?? [];
  return normalizeOptionalLowercaseString(raw);
}

/** Splits a Content-Type header into normalized MIME and optional charset. */
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

/** Builds a normalized MIME allowlist from config values or fallback defaults. */
export function normalizeMimeList(values: string[] | undefined, fallback: string[]): Set<string> {
  const input = values && values.length > 0 ? values : fallback;
  return new Set(input.flatMap((value) => normalizeMimeType(value) ?? []));
}

/** Applies defaults to optional file input limit config. */
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

/** Fetches an input URL through SSRF guardrails with redirect, timeout, and byte limits. */
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

/** Extracts and normalizes an image from base64 or guarded URL input. */
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

/** Extracts text/images from a base64 or guarded URL file input according to MIME-specific handling. */
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
