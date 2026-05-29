// extensions/imessage runtime api helpers and runtime behavior.
import type { OpenClawConfig as RuntimeApiOpenClawConfig } from "openclaw/plugin-sdk/config-contracts";

/** Re-exported imessage plugin public API. */
export {
  DEFAULT_ACCOUNT_ID,
  getChatChannelMeta,
  type ChannelPlugin,
} from "openclaw/plugin-sdk/core";
/** Re-exported imessage plugin public API, starting with build Channel Config Schema. */
export { buildChannelConfigSchema, IMessageConfigSchema } from "./config-api.js";
/** Re-exported imessage plugin public API, starting with PAIRING APPROVED MESSAGE. */
export { PAIRING_APPROVED_MESSAGE } from "openclaw/plugin-sdk/channel-status";
/** Re-exported imessage plugin public API. */
export {
  buildComputedAccountStatusSnapshot,
  collectStatusIssuesFromLastError,
} from "openclaw/plugin-sdk/status-helpers";
/** Re-exported imessage plugin public API, starting with format Trimmed Allow From Entries. */
export { formatTrimmedAllowFromEntries } from "openclaw/plugin-sdk/channel-config-helpers";
/** Re-exported imessage plugin public API. */
export {
  resolveIMessageConfigAllowFrom,
  resolveIMessageConfigDefaultTo,
} from "./src/config-accessors.js";
/** Re-exported imessage plugin public API, starting with looks Like IMessage Target Id. */
export { looksLikeIMessageTargetId, normalizeIMessageMessagingTarget } from "./src/normalize.js";
/** Re-exported imessage plugin public API, starting with resolve Channel Media Max Bytes. */
export { resolveChannelMediaMaxBytes } from "openclaw/plugin-sdk/media-runtime";
/** Re-exported imessage plugin public API. */
export {
  resolveIMessageGroupRequireMention,
  resolveIMessageGroupToolPolicy,
} from "./src/group-policy.js";

/** Re-exported imessage plugin public API, starting with monitor IMessage Provider. */
export { monitorIMessageProvider } from "./src/monitor.js";
/** Re-exported imessage plugin public API, starting with Monitor IMessage Opts. */
export type { MonitorIMessageOpts } from "./src/monitor.js";
/** Re-exported imessage plugin public API, starting with probe IMessage. */
export { probeIMessage } from "./src/probe.js";
/** Re-exported imessage plugin public API, starting with IMessage Probe. */
export type { IMessageProbe } from "./src/probe.js";
/** Re-exported imessage plugin public API, starting with send Message IMessage. */
export { sendMessageIMessage } from "./src/send.js";
/** Re-exported imessage plugin public API, starting with imessage Message Actions. */
export { imessageMessageActions } from "./src/actions.js";
/** Re-exported imessage plugin public API, starting with set IMessage Runtime. */
export { setIMessageRuntime } from "./src/runtime.js";
/** Re-exported imessage plugin public API, starting with chunk Text For Outbound. */
export { chunkTextForOutbound } from "./src/channel-api.js";
/** Public imessage plugin type for IMessage Account Config. */
export type IMessageAccountConfig = Omit<
  NonNullable<NonNullable<RuntimeApiOpenClawConfig["channels"]>["imessage"]>,
  "accounts" | "defaultAccount"
>;
