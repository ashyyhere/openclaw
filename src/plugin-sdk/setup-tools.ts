/** Public SDK barrel for setup command formatting helpers. */
export { formatCliCommand } from "../cli/command-format.js";
/** Re-exported API for src/plugin-sdk, starting with extract Archive. */
export { extractArchive } from "../infra/archive.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Brew Executable. */
export { resolveBrewExecutable } from "../infra/brew.js";
/** Re-exported API for src/plugin-sdk, starting with detect Binary. */
export { detectBinary } from "../plugins/setup-binary.js";
export { formatDocsLink } from "../../packages/terminal-core/src/links.js";
export { CONFIG_DIR } from "../utils.js";
