/** Compatibility facade for auth profile path helpers and file initialization. */
import fs from "node:fs";
import { saveJsonFile } from "../../infra/json-file.js";
import { AUTH_STORE_VERSION } from "./constants.js";
import type { AuthProfileSecretsStore } from "./types.js";
/** Auth profile path resolution helpers. */
export {
  resolveAuthStatePath,
  resolveAuthStatePathForDisplay,
  resolveAuthStorePath,
  resolveAuthStorePathForDisplay,
  resolveLegacyAuthStorePath,
  resolveOAuthRefreshLockPath,
} from "./path-resolve.js";

/** Creates an empty auth profile store file when missing. */
export function ensureAuthStoreFile(pathname: string) {
  if (fs.existsSync(pathname)) {
    return;
  }
  const payload: AuthProfileSecretsStore = {
    version: AUTH_STORE_VERSION,
    profiles: {},
  };
  saveJsonFile(pathname, payload);
}
