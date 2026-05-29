// extensions/clickclack runtime api helpers and runtime behavior.
/** Re-exported clickclack plugin public API. */
export {
  type ClickClackAccountConfig,
  type ClickClackEvent,
  type ClickClackMessage,
  type ClickClackTarget,
  type ResolvedClickClackAccount,
  createClickClackClient,
  parseClickClackTarget,
  resolveClickClackAccount,
  setClickClackRuntime,
} from "./api.js";
