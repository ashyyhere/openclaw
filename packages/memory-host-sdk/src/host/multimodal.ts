// Multimodal memory indexing settings and file classification helpers.
import { normalizeLowercaseStringOrEmpty } from "./string-utils.js";

const MEMORY_MULTIMODAL_SPECS = {
  image: {
    labelPrefix: "Image file",
    extensions: [".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic", ".heif"],
  },
  audio: {
    labelPrefix: "Audio file",
    extensions: [".mp3", ".wav", ".ogg", ".opus", ".m4a", ".aac", ".flac"],
  },
} as const;

/** Multimodal file families supported by memory indexing. */
export type MemoryMultimodalModality = keyof typeof MEMORY_MULTIMODAL_SPECS;
/** Ordered list of supported multimodal memory file families. */
export const MEMORY_MULTIMODAL_MODALITIES = Object.keys(
  MEMORY_MULTIMODAL_SPECS,
) as MemoryMultimodalModality[];
/** Config selection for one modality or all supported modalities. */
export type MemoryMultimodalSelection = MemoryMultimodalModality | "all";

/** Normalized multimodal memory indexing settings. */
export type MemoryMultimodalSettings = {
  enabled: boolean;
  modalities: MemoryMultimodalModality[];
  maxFileBytes: number;
};

/** Default maximum multimodal file size accepted for indexing. */
export const DEFAULT_MEMORY_MULTIMODAL_MAX_FILE_BYTES = 10 * 1024 * 1024;

/** Normalizes raw modality selection, expanding "all" to every supported modality. */
export function normalizeMemoryMultimodalModalities(
  raw: MemoryMultimodalSelection[] | undefined,
): MemoryMultimodalModality[] {
  if (raw === undefined || raw.includes("all")) {
    return [...MEMORY_MULTIMODAL_MODALITIES];
  }
  const normalized = new Set<MemoryMultimodalModality>();
  for (const value of raw) {
    if (value === "image" || value === "audio") {
      normalized.add(value);
    }
  }
  return Array.from(normalized);
}

/** Normalizes enablement, modalities, and max file size for multimodal indexing. */
export function normalizeMemoryMultimodalSettings(raw: {
  enabled?: boolean;
  modalities?: MemoryMultimodalSelection[];
  maxFileBytes?: number;
}): MemoryMultimodalSettings {
  const enabled = raw.enabled === true;
  const maxFileBytes =
    typeof raw.maxFileBytes === "number" && Number.isFinite(raw.maxFileBytes)
      ? Math.max(1, Math.floor(raw.maxFileBytes))
      : DEFAULT_MEMORY_MULTIMODAL_MAX_FILE_BYTES;
  return {
    enabled,
    modalities: enabled ? normalizeMemoryMultimodalModalities(raw.modalities) : [],
    maxFileBytes,
  };
}

/** Returns true when multimodal indexing is enabled with at least one modality. */
export function isMemoryMultimodalEnabled(settings: MemoryMultimodalSettings): boolean {
  return settings.enabled && settings.modalities.length > 0;
}

/** Lists file extensions associated with a multimodal modality. */
export function getMemoryMultimodalExtensions(
  modality: MemoryMultimodalModality,
): readonly string[] {
  return MEMORY_MULTIMODAL_SPECS[modality].extensions;
}

/** Builds the text label stored for a multimodal memory file. */
export function buildMemoryMultimodalLabel(
  modality: MemoryMultimodalModality,
  normalizedPath: string,
): string {
  return `${MEMORY_MULTIMODAL_SPECS[modality].labelPrefix}: ${normalizedPath}`;
}

/** Builds a case-insensitive glob for an extension without relying on glob flags. */
export function buildCaseInsensitiveExtensionGlob(extension: string): string {
  const normalized = normalizeLowercaseStringOrEmpty(extension).replace(/^\./, "");
  if (!normalized) {
    return "*";
  }
  const parts = Array.from(normalized, (char) => `[${char.toLowerCase()}${char.toUpperCase()}]`);
  return `*.${parts.join("")}`;
}

/** Classifies a file path into a supported modality under normalized settings. */
export function classifyMemoryMultimodalPath(
  filePath: string,
  settings: MemoryMultimodalSettings,
): MemoryMultimodalModality | null {
  if (!isMemoryMultimodalEnabled(settings)) {
    return null;
  }
  const lower = normalizeLowercaseStringOrEmpty(filePath);
  for (const modality of settings.modalities) {
    for (const extension of getMemoryMultimodalExtensions(modality)) {
      if (lower.endsWith(extension)) {
        return modality;
      }
    }
  }
  return null;
}
