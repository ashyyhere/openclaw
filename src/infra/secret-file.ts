/** Re-exports secure secret-file primitives and legacy read result adapter. */
import "./fs-safe-defaults.js";
import { readSecretFileSync as readSecretFileSyncImpl } from "@openclaw/fs-safe/secret";
import { resolveUserPath } from "../utils.js";

/** Secret-file read constants and helpers from fs-safe. */
export {
  DEFAULT_SECRET_FILE_MAX_BYTES,
  PRIVATE_SECRET_DIR_MODE,
  PRIVATE_SECRET_FILE_MODE,
  readSecretFileSync,
  tryReadSecretFileSync,
  type SecretFileReadOptions,
} from "@openclaw/fs-safe/secret";
/** Atomic private secret-file writer exposed under the infra naming convention. */
export { writeSecretFileAtomic as writePrivateSecretFileAtomic } from "@openclaw/fs-safe/secret";

/** Legacy result shape for callers that still need message/error fields instead of throws. */
export type SecretFileReadResult =
  | {
      ok: true;
      secret: string;
      resolvedPath: string;
    }
  | {
      ok: false;
      message: string;
      resolvedPath?: string;
      error?: unknown;
    };

/** @deprecated Use readSecretFileSync() or tryReadSecretFileSync(). */
export function loadSecretFileSync(
  filePath: string,
  label: string,
  options: Parameters<typeof readSecretFileSyncImpl>[2] = {},
): SecretFileReadResult {
  const trimmedPath = filePath.trim();
  const resolvedPath = resolveUserPath(trimmedPath);
  if (!resolvedPath) {
    return { ok: false, message: `${label} file path is empty.` };
  }

  try {
    return {
      ok: true,
      secret: readSecretFileSyncImpl(filePath, label, options),
      resolvedPath,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error),
      resolvedPath,
      error,
    };
  }
}
