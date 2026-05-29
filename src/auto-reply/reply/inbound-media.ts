// Inbound media normalization for reply context.
import { normalizeOptionalString } from "../../shared/string-coerce.js";

/** Shared type for Inbound Media Context in src/auto-reply/reply. */
export type InboundMediaContext = {
  StickerMediaIncluded?: unknown;
  Sticker?: unknown;
  MediaPath?: unknown;
  MediaUrl?: unknown;
  MediaPaths?: readonly unknown[];
  MediaUrls?: readonly unknown[];
  MediaTypes?: readonly unknown[];
};

function hasNormalizedStringEntry(values: readonly unknown[] | undefined): boolean {
  return Array.isArray(values) && values.some((value) => normalizeOptionalString(value));
}

/** Reused helper for has Inbound Media behavior in src/auto-reply/reply. */
export function hasInboundMedia(ctx: InboundMediaContext): boolean {
  return Boolean(
    ctx.StickerMediaIncluded ||
    ctx.Sticker ||
    normalizeOptionalString(ctx.MediaPath) ||
    normalizeOptionalString(ctx.MediaUrl) ||
    hasNormalizedStringEntry(ctx.MediaPaths) ||
    hasNormalizedStringEntry(ctx.MediaUrls) ||
    (Array.isArray(ctx.MediaTypes) && ctx.MediaTypes.length > 0),
  );
}
