// Centralizes fs imports used by openclaw-root helpers so tests can replace the
// boundary without patching every root/path caller.
/** Synchronous fs facade used by root discovery and permission checks. */
export { default as openClawRootFsSync } from "node:fs";
/** Promise fs facade used by async root setup and path validation. */
export { default as openClawRootFs } from "node:fs/promises";
