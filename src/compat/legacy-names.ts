// Centralized current and legacy product names used by compatibility code.
/** Canonical package/config/product key for current OpenClaw compatibility code. */
export const PROJECT_NAME = "openclaw" as const;

const LEGACY_PROJECT_NAMES = ["clawdbot"] as const;

/** Manifest key written for current OpenClaw manifests. */
export const MANIFEST_KEY = PROJECT_NAME;

/** Legacy manifest keys accepted only where an explicit compatibility path exists. */
export const LEGACY_MANIFEST_KEYS = LEGACY_PROJECT_NAMES;

/** Current macOS app source directory used by build/release compatibility helpers. */
export const MACOS_APP_SOURCES_DIR = "apps/macos/Sources/OpenClaw" as const;
