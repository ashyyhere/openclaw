// gateway server shared helpers and runtime behavior.
import type { ErrorShape } from "../../packages/gateway-protocol/src/index.js";

/** Shared type for Dedupe Entry in src/gateway. */
export type DedupeEntry = {
  ts: number;
  ok: boolean;
  payload?: unknown;
  error?: ErrorShape;
};
