// Runtime boundary for extensions/whatsapp/src/auto-reply config runtime behavior.
export {
  evaluateSessionFreshness,
  loadSessionStore,
  resolveSessionKey,
  resolveSessionResetPolicy,
  resolveSessionResetType,
  resolveStorePath,
  resolveThreadFlag,
  resolveChannelResetConfig,
  updateLastRoute,
} from "openclaw/plugin-sdk/session-store-runtime";
export {
  getRuntimeConfig,
  getRuntimeConfigSourceSnapshot,
} from "openclaw/plugin-sdk/runtime-config-snapshot";
export { resolveChannelContextVisibilityMode } from "openclaw/plugin-sdk/context-visibility-runtime";
