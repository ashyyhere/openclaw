// extensions/feishu api helpers and runtime behavior.
/** Re-exported feishu plugin public API, starting with feishu Plugin. */
export { feishuPlugin } from "./src/channel.js";
/** Re-exported feishu plugin public API, starting with register Feishu Doc Tools. */
export { registerFeishuDocTools } from "./src/docx.js";
/** Re-exported feishu plugin public API, starting with register Feishu Chat Tools. */
export { registerFeishuChatTools } from "./src/chat.js";
/** Re-exported feishu plugin public API, starting with register Feishu Wiki Tools. */
export { registerFeishuWikiTools } from "./src/wiki.js";
/** Re-exported feishu plugin public API, starting with register Feishu Drive Tools. */
export { registerFeishuDriveTools } from "./src/drive.js";
/** Re-exported feishu plugin public API, starting with register Feishu Perm Tools. */
export { registerFeishuPermTools } from "./src/perm.js";
/** Re-exported feishu plugin public API, starting with register Feishu Bitable Tools. */
export { registerFeishuBitableTools } from "./src/bitable.js";
/** Re-exported feishu plugin public API. */
export {
  handleFeishuSubagentDeliveryTarget,
  handleFeishuSubagentEnded,
  handleFeishuSubagentSpawning,
} from "./src/subagent-hooks.js";
/** Re-exported feishu plugin public API. */
export {
  buildFeishuConversationId,
  buildFeishuModelOverrideParentCandidates,
  type FeishuGroupSessionScope,
  parseFeishuConversationId,
  parseFeishuDirectConversationId,
  parseFeishuTargetId,
} from "./src/conversation-id.js";
/** Re-exported feishu plugin public API, starting with feishu Setup Adapter. */
export { feishuSetupAdapter, setFeishuNamedAccountEnabled } from "./src/setup-core.js";
/** Re-exported feishu plugin public API, starting with feishu Setup Wizard. */
export { feishuSetupWizard, runFeishuLogin } from "./src/setup-surface.js";
/** Re-exported feishu plugin public API. */
export {
  testing as __testing,
  testing,
  createFeishuThreadBindingManager,
  getFeishuThreadBindingManager,
} from "./src/thread-bindings.js";
/** Re-exported feishu plugin public API, starting with testing. */
export { testing as feishuThreadBindingTesting } from "./src/thread-bindings.js";
/** Re-exported feishu plugin public API, starting with create Clack Prompter. */
export { createClackPrompter } from "openclaw/plugin-sdk/setup-runtime";

/** Public feishu plugin constant for feishu Session Binding Adapter Channels behavior. */
export const feishuSessionBindingAdapterChannels = ["feishu"] as const;
