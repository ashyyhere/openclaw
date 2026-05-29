// Centralized current and legacy product names used by compatibility code.
/** Reused constant for PROJECT NAME behavior in src/compat. */
export const PROJECT_NAME = "openclaw" as const;

const LEGACY_PROJECT_NAMES = ["clawdbot"] as const;

/** Reused constant for MANIFEST KEY behavior in src/compat. */
export const MANIFEST_KEY = PROJECT_NAME;

/** Reused constant for LEGACY MANIFEST KEYS behavior in src/compat. */
export const LEGACY_MANIFEST_KEYS = LEGACY_PROJECT_NAMES;

/** Reused constant for MACOS APP SOURCES DIR behavior in src/compat. */
export const MACOS_APP_SOURCES_DIR = "apps/macos/Sources/OpenClaw" as const;
