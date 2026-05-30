// Bundled plugin Vitest path constants centralize extension test glob roots.
/** Repository root directory for bundled plugins. */
export const BUNDLED_PLUGIN_ROOT_DIR = "extensions";
/** Path prefix shared by bundled plugin files. */
export const BUNDLED_PLUGIN_PATH_PREFIX = `${BUNDLED_PLUGIN_ROOT_DIR}/`;
/** Unit test glob for bundled plugins. */
export const BUNDLED_PLUGIN_TEST_GLOB = `${BUNDLED_PLUGIN_ROOT_DIR}/**/*.test.ts`;
/** E2E test glob for bundled plugins. */
export const BUNDLED_PLUGIN_E2E_TEST_GLOB = `${BUNDLED_PLUGIN_ROOT_DIR}/**/*.e2e.test.ts`;
/** Live test glob for bundled plugins. */
export const BUNDLED_PLUGIN_LIVE_TEST_GLOB = `${BUNDLED_PLUGIN_ROOT_DIR}/**/*.live.test.ts`;
