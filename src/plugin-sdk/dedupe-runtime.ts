// In-memory dedupe helpers for plugin runtime hot paths.

/** Re-exported API for src/plugin-sdk, starting with create Dedupe Cache. */
export { createDedupeCache, resolveGlobalDedupeCache } from "../infra/dedupe.js";
