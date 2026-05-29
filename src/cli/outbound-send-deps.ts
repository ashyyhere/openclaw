/** Adapts CLI dependency sources into outbound send dependencies. */
import type { OutboundSendDeps } from "../infra/outbound/send-deps.js";
import type { CliDeps } from "./deps.types.js";
import { createOutboundSendDepsFromCliSource } from "./outbound-send-mapping.js";

/** Re-exported API for src/cli, starting with Cli Deps. */
export type { CliDeps } from "./deps.types.js";

/** Reused helper for create Outbound Send Deps behavior in src/cli. */
export function createOutboundSendDeps(deps: CliDeps): OutboundSendDeps {
  return createOutboundSendDepsFromCliSource(deps);
}
