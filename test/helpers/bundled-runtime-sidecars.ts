// Bundled runtime sidecar fixtures list build artifacts expected in packaged core tests.
/** Runtime sidecar paths that package tests expect bundled builds to emit. */
export const TEST_BUNDLED_RUNTIME_SIDECAR_PATHS = [
  "dist/extensions/discord/runtime-api.js",
  "dist/extensions/telegram/runtime-api.js",
  "dist/extensions/telegram/thread-bindings-runtime.js",
] as const;
