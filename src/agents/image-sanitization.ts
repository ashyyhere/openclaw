/** Resolves image size limits for provider/tool input sanitization. */
import type { OpenClawConfig } from "../config/types.openclaw.js";

/** Image sanitization limits derived from config. */
export type ImageSanitizationLimits = {
  maxDimensionPx?: number;
  maxBytes?: number;
};

/** Default maximum image dimension for sanitization. */
export const DEFAULT_IMAGE_MAX_DIMENSION_PX = 1200;
/** Default maximum image bytes for sanitization. */
export const DEFAULT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

/** Resolve effective image sanitization limits from config. */
export function resolveImageSanitizationLimits(cfg?: OpenClawConfig): ImageSanitizationLimits {
  const configured = cfg?.agents?.defaults?.imageMaxDimensionPx;
  if (typeof configured !== "number" || !Number.isFinite(configured)) {
    return {};
  }
  return { maxDimensionPx: Math.max(1, Math.floor(configured)) };
}
