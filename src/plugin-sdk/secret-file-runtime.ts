/** Runtime SDK barrel for secret file read helpers. */
export {
  DEFAULT_SECRET_FILE_MAX_BYTES,
  PRIVATE_SECRET_DIR_MODE,
  PRIVATE_SECRET_FILE_MODE,
  loadSecretFileSync,
  readSecretFileSync,
  writePrivateSecretFileAtomic,
  tryReadSecretFileSync,
} from "../infra/secret-file.js";
/** Re-exported API for src/plugin-sdk, starting with Secret File Read Options. */
export type { SecretFileReadOptions, SecretFileReadResult } from "../infra/secret-file.js";
