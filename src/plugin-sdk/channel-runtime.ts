/**
 * @deprecated Compatibility shim only. Keep old plugins working, but do not
 * add new imports here and do not use this subpath from repo code.
 * Prefer the dedicated generic plugin-sdk subpaths instead.
 */

export * from "../channels/chat-type.js";
export * from "../channels/reply-prefix.js";
export * from "../channels/typing.js";
/** Shared type for this surface in src/plugin-sdk. */
export type * from "../channels/plugins/types.public.js";
/** Re-exported API for src/plugin-sdk, starting with normalize Channel Id. */
export { normalizeChannelId } from "../channels/plugins/registry.js";
export * from "../channels/plugins/outbound/interactive.js";
export * from "../polls.js";
/** Re-exported API for src/plugin-sdk, starting with enqueue System Event. */
export { enqueueSystemEvent, resetSystemEventsForTest } from "../infra/system-events.js";
/** Re-exported API for src/plugin-sdk, starting with record Channel Activity. */
export { recordChannelActivity } from "../infra/channel-activity.js";
export * from "../infra/heartbeat-events.ts";
export * from "../infra/heartbeat-visibility.ts";
export * from "../infra/transport-ready.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createAccountStatusSink,
  keepHttpServerTaskAlive,
  waitUntilAbort,
} from "./channel-lifecycle.core.js";
