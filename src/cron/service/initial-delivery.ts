// cron/service initial delivery helpers and runtime behavior.
import type { CronDelivery, CronJobCreate } from "../types.js";

/** Reused helper for resolve Initial Cron Delivery behavior in src/cron/service. */
export function resolveInitialCronDelivery(input: CronJobCreate): CronDelivery | undefined {
  if (input.delivery) {
    return input.delivery;
  }
  if (input.sessionTarget === "isolated" && input.payload.kind === "agentTurn") {
    return { mode: "announce" };
  }
  return undefined;
}
