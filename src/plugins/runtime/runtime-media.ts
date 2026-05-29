// plugins/runtime runtime media helpers and runtime behavior.
import { isVoiceCompatibleAudio } from "../../media/audio.js";
import { mediaKindFromMime } from "../../media/constants.js";
import { getImageMetadata, resizeToJpeg } from "../../media/media-services.js";
import { detectMime } from "../../media/mime.js";
import { loadWebMedia } from "../../media/web-media.js";
import type { PluginRuntime } from "./types.js";

/** Reused helper for create Runtime Media behavior in src/plugins/runtime. */
export function createRuntimeMedia(): PluginRuntime["media"] {
  return {
    loadWebMedia,
    detectMime,
    mediaKindFromMime,
    isVoiceCompatibleAudio,
    getImageMetadata,
    resizeToJpeg,
  };
}
