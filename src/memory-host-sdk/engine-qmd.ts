// Re-exports QMD binary availability helpers for memory host integrations.
/** Public QMD availability checks and unavailable-reason types. */
export {
  checkQmdBinaryAvailability,
  resolveQmdBinaryUnavailableReason,
  type QmdBinaryAvailability,
  type QmdBinaryUnavailable,
  type QmdBinaryUnavailableReason,
} from "../../packages/memory-host-sdk/src/engine-qmd.js";
