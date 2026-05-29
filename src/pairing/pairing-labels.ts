// pairing pairing labels helpers and runtime behavior.
import { getPairingAdapter } from "../channels/plugins/pairing.js";
import type { PairingChannel } from "./pairing-store.types.js";

/** Reused helper for resolve Pairing Id Label behavior in src/pairing. */
export function resolvePairingIdLabel(channel: PairingChannel): string {
  return getPairingAdapter(channel)?.idLabel ?? "userId";
}
