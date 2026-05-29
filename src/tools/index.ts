// Public barrel for tool descriptor, planning, availability, and protocol contracts.
/** Re-exports availability diagnostics for descriptor gating. */
export { evaluateToolAvailability } from "./availability.js";
/** Re-exports descriptor identity helpers. */
export { defineToolDescriptor, defineToolDescriptors } from "./descriptors.js";
/** Re-exports tool-planning contract errors. */
export { ToolPlanContractError } from "./diagnostics.js";
/** Re-exports executor reference formatting. */
export { formatToolExecutorRef } from "./execution.js";
/** Re-exports deterministic tool planning. */
export { buildToolPlan } from "./planner.js";
/** Re-exports provider-facing protocol projection helpers. */
export { toToolProtocolDescriptor, toToolProtocolDescriptors } from "./protocol.js";
/** Re-exports public tool descriptor and planning types. */
export type {
  BuildToolPlanOptions,
  HiddenToolPlanEntry,
  JsonObject,
  JsonPrimitive,
  JsonValue,
  ToolAvailabilityContext,
  ToolAvailabilityDiagnostic,
  ToolAvailabilityExpression,
  ToolAvailabilitySignal,
  ToolDescriptor,
  ToolExecutorRef,
  ToolOwnerRef,
  ToolPlan,
  ToolPlanEntry,
  ToolUnavailableReason,
} from "./types.js";
