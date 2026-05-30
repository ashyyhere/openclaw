import type { OutboundSendDeps } from "../infra/outbound/send-deps.js";
import type { CliDeps } from "./deps.types.js";
import { createOutboundSendDepsFromCliSource } from "./outbound-send-mapping.js";

/**
 * Re-export CLI dependency shape used to construct outbound send adapters.
 */
export type { CliDeps } from "./deps.types.js";

/** Convert CLI dependencies into the outbound sender dependency bundle. */
export function createOutboundSendDeps(deps: CliDeps): OutboundSendDeps {
  return createOutboundSendDepsFromCliSource(deps);
}
