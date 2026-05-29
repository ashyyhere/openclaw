// Image probing and resizing helpers backed by rastermill plus trusted system
// tools. Callers get stable OpenClaw errors when native processing is missing.
import {
  createRastermill,
  isRastermillUnavailableError,
  RastermillError,
  RastermillUnavailableError,
  readImageProbeFromHeader as readRastermillImageProbeFromHeader,
  readImageMetadataFromHeader as readRastermillImageMetadataFromHeader,
  type ImageProbe,
  type ImageMetadata,
} from "rastermill";
import { resolveSystemBin } from "../infra/resolve-system-bin.js";
import { resolvePreferredOpenClawTmpDir } from "../infra/tmp-openclaw-dir.js";

/** Rastermill metadata/probe types re-exported for media callers. */
export type { ImageMetadata, ImageProbe };

/** Stable error raised when local image processing dependencies are unavailable. */
export class ImageProcessorUnavailableError extends Error {
  readonly code = "IMAGE_PROCESSOR_UNAVAILABLE";
  readonly operation: string;
  readonly causes: unknown[];

  constructor(operation: string, message?: string, causes: unknown[] = []) {
    super(message ?? `Image processor unavailable for ${operation}`, {
      cause: causes.find((cause): cause is Error => cause instanceof Error),
    });
    this.name = "ImageProcessorUnavailableError";
    this.operation = operation;
    this.causes = causes;
  }
}

/** Parameters for JPEG resize/encode operations. */
export type ResizeToJpegParams = {
  buffer: Buffer;
  maxSide: number;
  quality: number;
  withoutEnlargement?: boolean;
};

/** Parameters for PNG resize/encode operations. */
export type ResizeToPngParams = {
  buffer: Buffer;
  maxSide: number;
  compressionLevel?: number;
  withoutEnlargement?: boolean;
};

/** JPEG quality steps tried when reducing image byte size. */
export const IMAGE_REDUCE_QUALITY_STEPS = [85, 75, 65, 55, 45, 35] as const;
/** Maximum decoded image pixels accepted by local image processing. */
export const MAX_IMAGE_INPUT_PIXELS = 25_000_000;

/** Create a rastermill processor with OpenClaw temp paths, limits, and binary policy. */
export function createImageProcessor() {
  return createRastermill({
    execution: "auto",
    limits: {
      inputPixels: MAX_IMAGE_INPUT_PIXELS,
      outputPixels: MAX_IMAGE_INPUT_PIXELS,
    },
    temp: {
      rootDir: resolvePreferredOpenClawTmpDir(),
      prefix: "openclaw-img-",
    },
    commandResolver: (command) =>
      resolveSystemBin(command, { trust: command === "powershell" ? "strict" : "standard" }),
  });
}

/** Detect OpenClaw or rastermill unavailable-processor errors. */
export function isImageProcessorUnavailableError(err: unknown): boolean {
  return err instanceof ImageProcessorUnavailableError || isRastermillUnavailableError(err);
}

/** Build descending resize candidates capped by the requested max side. */
export function buildImageResizeSideGrid(maxSide: number, sideStart: number): number[] {
  return [sideStart, 1800, 1600, 1400, 1200, 1000, 800]
    .map((value) => Math.min(maxSide, value))
    .filter((value, idx, arr) => value > 0 && arr.indexOf(value) === idx)
    .toSorted((a, b) => b - a);
}

/** Read width/height from image header bytes when possible. */
export function readImageMetadataFromHeader(buffer: Buffer): ImageMetadata | null {
  return readRastermillImageMetadataFromHeader(buffer);
}

/** Read lightweight image probe facts from header bytes when possible. */
export function readImageProbeFromHeader(buffer: Buffer): ImageProbe | null {
  return readRastermillImageProbeFromHeader(buffer);
}

function wrapRastermillUnavailable(operation: string, error: unknown): never {
  if (error instanceof RastermillUnavailableError) {
    throw new ImageProcessorUnavailableError(operation, error.message, error.causes);
  }
  throw error;
}

/** Probe full image metadata through rastermill. */
export async function getImageMetadata(buffer: Buffer): Promise<ImageMetadata | null> {
  const info = await createImageProcessor().probe(buffer);
  return info ? { width: info.width, height: info.height } : null;
}

/** Auto-orient images when EXIF orientation requires it, preserving bytes if unavailable. */
export async function normalizeExifOrientation(buffer: Buffer): Promise<Buffer> {
  try {
    const rastermill = createImageProcessor();
    const info = await rastermill.probe(buffer);
    if (!info) {
      return (await rastermill.encode(buffer, { format: "jpeg", autoOrient: true })).data;
    }
    if (!info?.orientation || info.orientation === 1) {
      return buffer;
    }
    return (await rastermill.encode(buffer, { format: "jpeg", autoOrient: true })).data;
  } catch (error) {
    if (isImageProcessorUnavailableError(error)) {
      return buffer;
    }
    throw error;
  }
}

/** Resize and encode an image to JPEG. */
export async function resizeToJpeg(params: ResizeToJpegParams): Promise<Buffer> {
  try {
    return (
      await createImageProcessor().encode(params.buffer, {
        format: "jpeg",
        resize: {
          maxSide: params.maxSide,
          enlarge: params.withoutEnlargement === false,
        },
        quality: params.quality,
      })
    ).data;
  } catch (error) {
    return wrapRastermillUnavailable("resizeToJpeg", error);
  }
}

/** Convert HEIC/HEIF input bytes to JPEG. */
export async function convertHeicToJpeg(buffer: Buffer): Promise<Buffer> {
  try {
    return (await createImageProcessor().encode(buffer, { format: "jpeg" })).data;
  } catch (error) {
    return wrapRastermillUnavailable("convertHeicToJpeg", error);
  }
}

/** Detect alpha transparency, falling back to header probes for undecodable images. */
export async function hasAlphaChannel(buffer: Buffer): Promise<boolean> {
  try {
    return (await createImageProcessor().transparency(buffer)).hasAlphaChannel;
  } catch (error) {
    const headerHasAlpha = readRastermillImageProbeFromHeader(buffer)?.hasAlpha === true;
    if (isRastermillUnavailableError(error)) {
      return headerHasAlpha;
    }
    if (
      error instanceof RastermillError &&
      error.code === "RASTERMILL_UNDECODABLE" &&
      readRastermillImageProbeFromHeader(buffer)
    ) {
      return headerHasAlpha;
    }
    throw error;
  }
}

/** Resize and encode an image to PNG. */
export async function resizeToPng(params: ResizeToPngParams): Promise<Buffer> {
  try {
    return (
      await createImageProcessor().encode(params.buffer, {
        format: "png",
        resize: {
          maxSide: params.maxSide,
          enlarge: params.withoutEnlargement === false,
        },
        ...(params.compressionLevel === undefined
          ? {}
          : { compressionLevel: params.compressionLevel }),
      })
    ).data;
  } catch (error) {
    return wrapRastermillUnavailable("resizeToPng", error);
  }
}

/** Search PNG resize/compression options until the output fits maxBytes. */
export async function optimizeImageToPng(
  buffer: Buffer,
  maxBytes: number,
  options?: { sides?: readonly number[] },
): Promise<{
  buffer: Buffer;
  optimizedSize: number;
  resizeSide: number;
  compressionLevel: number;
}> {
  let out;
  try {
    out = await createImageProcessor().encode(buffer, {
      format: "png",
      maxBytes,
      search: options?.sides === undefined ? {} : { maxSide: options.sides },
    });
  } catch (error) {
    wrapRastermillUnavailable("optimizeImageToPng", error);
  }
  return {
    buffer: out.data,
    optimizedSize: out.bytes,
    resizeSide: out.chosen.maxSide ?? out.width,
    compressionLevel: out.chosen.compressionLevel ?? 6,
  };
}
