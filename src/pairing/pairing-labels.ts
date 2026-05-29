// Pairing display labels derived from channel pairing adapters.
import { getPairingAdapter } from "../channels/plugins/pairing.js";
import type { PairingChannel } from "./pairing-store.types.js";

/** Returns the channel-specific sender id label shown in pairing prompts. */
export function resolvePairingIdLabel(channel: PairingChannel): string {
  return getPairingAdapter(channel)?.idLabel ?? "userId";
}
