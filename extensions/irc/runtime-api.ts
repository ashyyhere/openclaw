// Keep the bundled runtime entry narrow so generic runtime activation does not
// import the broad IRC API barrel just to install runtime state.
/** Re-exported irc plugin public API, starting with set Irc Runtime. */
export { setIrcRuntime } from "./src/runtime.js";
