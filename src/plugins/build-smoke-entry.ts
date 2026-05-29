// plugins build smoke entry helpers and runtime behavior.
/** Re-exported API for src/plugins. */
export {
  clearPluginCommands,
  executePluginCommand,
  getPluginCommandSpecs,
  matchPluginCommand,
} from "./commands.js";
/** Re-exported API for src/plugins, starting with load Open Claw Plugins. */
export { loadOpenClawPlugins } from "./loader.js";
