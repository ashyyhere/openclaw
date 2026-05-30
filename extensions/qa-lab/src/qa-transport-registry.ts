// QA Lab transport registry maps transport ids to adapters and default suite concurrency.
import type { QaBusState } from "./bus-state.js";
import {
  createQaChannelTransport,
  QA_CHANNEL_DEFAULT_SUITE_CONCURRENCY,
} from "./qa-channel-transport.js";
import type { QaTransportAdapter } from "./qa-transport.js";

/** Supported QA transport ids. */
export type QaTransportId = "qa-channel";

const DEFAULT_QA_TRANSPORT_ID: QaTransportId = "qa-channel";

const QA_TRANSPORT_REGISTRY = {
  "qa-channel": {
    create: createQaChannelTransport,
    defaultSuiteConcurrency: QA_CHANNEL_DEFAULT_SUITE_CONCURRENCY,
  },
} as const satisfies Record<
  QaTransportId,
  {
    create: (state: QaBusState) => QaTransportAdapter;
    defaultSuiteConcurrency: number;
  }
>;

/** Normalizes a user-supplied QA transport id. */
export function normalizeQaTransportId(input?: string | null): QaTransportId {
  const transportId = input?.trim() || DEFAULT_QA_TRANSPORT_ID;
  if (Object.hasOwn(QA_TRANSPORT_REGISTRY, transportId)) {
    return transportId as QaTransportId;
  }
  throw new Error(`unsupported QA transport: ${transportId}`);
}

/** Creates the QA transport adapter for a registered transport id. */
export function createQaTransportAdapter(params: {
  id: QaTransportId;
  state: QaBusState;
}): QaTransportAdapter {
  return QA_TRANSPORT_REGISTRY[params.id].create(params.state);
}

/** Returns the default suite concurrency for a transport id. */
export function defaultQaSuiteConcurrencyForTransport(id: QaTransportId): number {
  return QA_TRANSPORT_REGISTRY[id].defaultSuiteConcurrency;
}
