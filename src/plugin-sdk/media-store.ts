// Narrow media store helpers for channel runtimes that do not need the full media runtime.

/** Re-exported API for src/plugin-sdk. */
export {
  readMediaBuffer,
  resolveMediaBufferPath,
  saveMediaBuffer,
  saveMediaStream,
} from "../media/store.js";
/** Re-exported API for src/plugin-sdk, starting with Saved Media. */
export type { SavedMedia } from "../media/store.js";
