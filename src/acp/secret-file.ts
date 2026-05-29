/** ACP secret-file reader with symlink rejection for gateway credentials. */
import { DEFAULT_SECRET_FILE_MAX_BYTES, readSecretFileSync } from "../infra/secret-file.js";

const MAX_SECRET_FILE_BYTES = DEFAULT_SECRET_FILE_MAX_BYTES;

/** Read one bounded ACP secret value from a regular file. */
export function readSecretFromFile(filePath: string, label: string): string {
  return readSecretFileSync(filePath, label, {
    maxBytes: MAX_SECRET_FILE_BYTES,
    rejectSymlink: true,
  });
}
