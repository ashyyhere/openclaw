// Lazy runtime entrypoint for the voice-call plugin. Core imports this boundary
// only when the plugin is activated, keeping provider modules off metadata paths.
export { createVoiceCallRuntime, type VoiceCallRuntime } from "./src/runtime.js";
