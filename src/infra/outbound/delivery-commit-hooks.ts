// Outbound delivery after-commit hooks.
// Hooks attach to result objects so senders can defer side effects until delivery is committed.
import { createSubsystemLogger } from "../../logging/subsystem.js";
import { formatErrorMessage } from "../errors.js";
import type { OutboundDeliveryResult } from "./deliver-types.js";

/** Side effect to run only after an outbound delivery result is accepted. */
export type OutboundDeliveryCommitHook = () => Promise<void>;

const log = createSubsystemLogger("outbound/deliver");
const outboundDeliveryCommitHooks = new WeakMap<
  OutboundDeliveryResult,
  OutboundDeliveryCommitHook[]
>();

/** Associate an optional commit hook with a delivery result without changing its public shape. */
export function attachOutboundDeliveryCommitHook<T extends OutboundDeliveryResult>(
  result: T,
  hook?: OutboundDeliveryCommitHook,
): T {
  if (!hook) {
    return result;
  }
  const hooks = outboundDeliveryCommitHooks.get(result) ?? [];
  hooks.push(hook);
  outboundDeliveryCommitHooks.set(result, hooks);
  return result;
}

/** Run any hooks attached to the accepted delivery results, logging failures as warnings. */
export async function runOutboundDeliveryCommitHooks(
  results: readonly OutboundDeliveryResult[],
): Promise<void> {
  for (const result of results) {
    for (const hook of outboundDeliveryCommitHooks.get(result) ?? []) {
      try {
        await hook();
      } catch (err) {
        log.warn("Plugin message adapter after-commit hook failed.", {
          channel: result.channel,
          messageId: result.messageId,
          error: formatErrorMessage(err),
        });
      }
    }
  }
}

/** Narrow unknown adapter output to a delivery-result array. */
export function isOutboundDeliveryResultArray(value: unknown): value is OutboundDeliveryResult[] {
  return Array.isArray(value);
}
