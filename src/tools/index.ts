// tools index helpers and runtime behavior.
/** Re-exported API for src/tools, starting with evaluate Tool Availability. */
export { evaluateToolAvailability } from "./availability.js";
/** Re-exported API for src/tools, starting with define Tool Descriptor. */
export { defineToolDescriptor, defineToolDescriptors } from "./descriptors.js";
/** Re-exported API for src/tools, starting with Tool Plan Contract Error. */
export { ToolPlanContractError } from "./diagnostics.js";
/** Re-exported API for src/tools, starting with format Tool Executor Ref. */
export { formatToolExecutorRef } from "./execution.js";
/** Re-exported API for src/tools, starting with build Tool Plan. */
export { buildToolPlan } from "./planner.js";
/** Re-exported API for src/tools, starting with to Tool Protocol Descriptor. */
export { toToolProtocolDescriptor, toToolProtocolDescriptors } from "./protocol.js";
/** Re-exported API for src/tools. */
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
