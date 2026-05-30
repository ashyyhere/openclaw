// Private fs-safe file-store factories.
// Stores are created with private permissions for credentials and local state.
import "./fs-safe-defaults.js";
import {
  fileStore,
  fileStoreSync,
  type FileStore,
  type FileStoreSync,
} from "@openclaw/fs-safe/store";

/** Async private file-store interface exposed by fs-safe. */
export type PrivateFileStore = FileStore;

/** Create an async private file store rooted at the given directory. */
export function privateFileStore(rootDir: string): FileStore {
  return fileStore({ rootDir, private: true });
}

/** Sync private file-store interface exposed by fs-safe. */
export type PrivateFileStoreSync = FileStoreSync;

/** Create a synchronous private file store rooted at the given directory. */
export function privateFileStoreSync(rootDir: string): PrivateFileStoreSync {
  return fileStoreSync({ rootDir, private: true });
}
