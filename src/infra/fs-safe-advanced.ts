// Wires advanced fs-safe helpers through the infra defaults bootstrap.
import "./fs-safe-defaults.js";
/** Re-export symlink, hardlink, and sibling-temp write guards with OpenClaw defaults loaded. */
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
