// Lightweight CLI metadata entry used by discovery without loading the full
// voice-call runtime.
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";

export default definePluginEntry({
  id: "voice-call",
  name: "Voice Call",
  description: "Voice call channel plugin",
  register(api) {
    api.registerCli(() => {}, { commands: ["voicecall"] });
  },
});
