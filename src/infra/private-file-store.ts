// infra private file store helpers and runtime behavior.
import "./fs-safe-defaults.js";
import {
  fileStore,
  fileStoreSync,
  type FileStore,
  type FileStoreSync,
} from "@openclaw/fs-safe/store";

/** Shared type for Private File Store in src/infra. */
export type PrivateFileStore = FileStore;

/** Reused helper for private File Store behavior in src/infra. */
export function privateFileStore(rootDir: string): FileStore {
  return fileStore({ rootDir, private: true });
}

/** Shared type for Private File Store Sync in src/infra. */
export type PrivateFileStoreSync = FileStoreSync;

/** Reused helper for private File Store Sync behavior in src/infra. */
export function privateFileStoreSync(rootDir: string): PrivateFileStoreSync {
  return fileStoreSync({ rootDir, private: true });
}
