/** Applies delivery defaults to plugin-owned tools. */
import type { DeliveryContext } from "../utils/delivery-context.types.js";
import type { AnyAgentTool } from "./tools/common.js";

/** Apply channel/thread delivery defaults to plugin tools when supported. */
export function applyPluginToolDeliveryDefaults(params: {
  tools: AnyAgentTool[];
  deliveryContext?: DeliveryContext;
}): AnyAgentTool[] {
  void params.deliveryContext;
  return params.tools;
}
