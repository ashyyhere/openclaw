// Safe local-file helpers for plugin runtime media and bridge code.

/** Re-exported API for src/plugin-sdk. */
export {
  readFileWithinRoot,
  readLocalFileFromRoots,
  root,
  writeFileWithinRoot,
} from "../infra/fs-safe.js";
/** Re-exported API for src/plugin-sdk, starting with basename From Media Source. */
export { basenameFromMediaSource, safeFileURLToPath } from "../infra/local-file-access.js";
