/** Runtime SDK helper for draining outbound deliveries without eagerly loading delivery runtime. */
import {
  drainPendingDeliveries as coreDrainPendingDeliveries,
  type DeliverFn,
} from "../infra/outbound/delivery-queue.js";

type OutboundDeliverRuntimeModule = typeof import("../infra/outbound/deliver-runtime.js");
type DrainPendingDeliveriesOptions = Omit<
  Parameters<typeof coreDrainPendingDeliveries>[0],
  "deliver"
> & {
  deliver?: DeliverFn;
};

let outboundDeliverRuntimePromise: Promise<OutboundDeliverRuntimeModule> | null = null;

async function loadOutboundDeliverRuntime(): Promise<OutboundDeliverRuntimeModule> {
  outboundDeliverRuntimePromise ??= import("../infra/outbound/deliver-runtime.js");
  return await outboundDeliverRuntimePromise;
}

/** Drain queued outbound deliveries, using an injected deliver function when tests/plugins provide one. */
export async function drainPendingDeliveries(opts: DrainPendingDeliveriesOptions): Promise<void> {
  const deliver =
    opts.deliver ?? (await loadOutboundDeliverRuntime()).deliverOutboundPayloadsInternal;
  await coreDrainPendingDeliveries({
    ...opts,
    deliver,
  });
}
