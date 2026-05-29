// Public agent harness surface for plugins that replace the low-level agent runtime.
// Keep model/vendor-specific protocol code in the plugin that registers the harness.

export * from "./agent-harness-runtime.js";
/** Re-exported API for src/plugin-sdk, starting with create Open Claw Coding Tools. */
export { createOpenClawCodingTools } from "../agents/agent-tools.js";
