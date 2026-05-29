// infra fs safe advanced helpers and runtime behavior.
import "./fs-safe-defaults.js";
/** Re-exported API for src/infra. */
export {
  assertNoHardlinkedFinalPath,
  assertNoSymlinkParents,
  assertNoSymlinkParentsSync,
  sameFileIdentity,
  sanitizeUntrustedFileName,
  writeSiblingTempFile,
  writeViaSiblingTempPath,
  type AssertNoSymlinkParentsOptions,
  type FileIdentityStat,
} from "@openclaw/fs-safe/advanced";
