// Process warning filtering facade for optional experimental runtime modules.
/** Installs and evaluates warning filters for noisy dependency/runtime warnings. */
export { installProcessWarningFilter, shouldIgnoreWarning } from "./openclaw-runtime-io.js";
/** Process warning shape accepted by the warning filter. */
export type { ProcessWarning } from "./openclaw-runtime-io.js";
