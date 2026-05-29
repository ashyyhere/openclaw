// infra secret file helpers and runtime behavior.
import "./fs-safe-defaults.js";
import { readSecretFileSync as readSecretFileSyncImpl } from "@openclaw/fs-safe/secret";
import { resolveUserPath } from "../utils.js";

/** Re-exported API for src/infra. */
export {
  DEFAULT_SECRET_FILE_MAX_BYTES,
  PRIVATE_SECRET_DIR_MODE,
  PRIVATE_SECRET_FILE_MODE,
  readSecretFileSync,
  tryReadSecretFileSync,
  type SecretFileReadOptions,
} from "@openclaw/fs-safe/secret";
/** Re-exported API for src/infra, starting with write Secret File Atomic. */
export { writeSecretFileAtomic as writePrivateSecretFileAtomic } from "@openclaw/fs-safe/secret";

/** Shared type for Secret File Read Result in src/infra. */
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
