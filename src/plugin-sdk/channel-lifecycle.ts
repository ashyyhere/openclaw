/** @deprecated Compatibility subpath. Use `openclaw/plugin-sdk/channel-outbound`. */
export * from "./channel-lifecycle.core.js";
export * from "../channels/draft-preview-finalizer.js";
export * from "../channels/draft-stream-controls.js";
export * from "../channels/draft-stream-loop.js";
/** Re-exported API for src/plugin-sdk, starting with create Run State Machine. */
export { createRunStateMachine } from "../channels/run-state-machine.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createArmableStallWatchdog,
  type ArmableStallWatchdog,
  type StallWatchdogTimeoutMeta,
} from "../channels/transport/stall-watchdog.js";
