// packages/memory-host-sdk/src/host multimodal helpers and runtime behavior.
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

/** Public type describing Memory Multimodal Modality for packages/memory-host-sdk. */
export type MemoryMultimodalModality = keyof typeof MEMORY_MULTIMODAL_SPECS;
/** Public constant for MEMORY MULTIMODAL MODALITIES behavior in packages/memory-host-sdk. */
export const MEMORY_MULTIMODAL_MODALITIES = Object.keys(
  MEMORY_MULTIMODAL_SPECS,
) as MemoryMultimodalModality[];
/** Public type describing Memory Multimodal Selection for packages/memory-host-sdk. */
export type MemoryMultimodalSelection = MemoryMultimodalModality | "all";

/** Public type describing Memory Multimodal Settings for packages/memory-host-sdk. */
export type MemoryMultimodalSettings = {
  enabled: boolean;
  modalities: MemoryMultimodalModality[];
  maxFileBytes: number;
};

/** Public constant for DEFAULT MEMORY MULTIMODAL MAX FILE BYTES behavior in packages/memory-host-sdk. */
export const DEFAULT_MEMORY_MULTIMODAL_MAX_FILE_BYTES = 10 * 1024 * 1024;

/** Public helper for normalize Memory Multimodal Modalities behavior in packages/memory-host-sdk. */
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

/** Public helper for normalize Memory Multimodal Settings behavior in packages/memory-host-sdk. */
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

/** Public helper for is Memory Multimodal Enabled behavior in packages/memory-host-sdk. */
export function isMemoryMultimodalEnabled(settings: MemoryMultimodalSettings): boolean {
  return settings.enabled && settings.modalities.length > 0;
}

/** Public helper for get Memory Multimodal Extensions behavior in packages/memory-host-sdk. */
export function getMemoryMultimodalExtensions(
  modality: MemoryMultimodalModality,
): readonly string[] {
  return MEMORY_MULTIMODAL_SPECS[modality].extensions;
}

/** Public helper for build Memory Multimodal Label behavior in packages/memory-host-sdk. */
export function buildMemoryMultimodalLabel(
  modality: MemoryMultimodalModality,
  normalizedPath: string,
): string {
  return `${MEMORY_MULTIMODAL_SPECS[modality].labelPrefix}: ${normalizedPath}`;
}

/** Public helper for build Case Insensitive Extension Glob behavior in packages/memory-host-sdk. */
export function buildCaseInsensitiveExtensionGlob(extension: string): string {
  const normalized = normalizeLowercaseStringOrEmpty(extension).replace(/^\./, "");
  if (!normalized) {
    return "*";
  }
  const parts = Array.from(normalized, (char) => `[${char.toLowerCase()}${char.toUpperCase()}]`);
  return `*.${parts.join("")}`;
}

/** Public helper for classify Memory Multimodal Path behavior in packages/memory-host-sdk. */
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
