// Shared types for pairing pairing store types behavior.
import type { ChannelId } from "../channels/plugins/channel-id.types.js";
import type { ChannelPairingAdapter } from "../channels/plugins/pairing.types.js";

/** Shared type for Pairing Channel in src/pairing. */
export type PairingChannel = ChannelId;

/** Shared type for Read Channel Allow From Store For Account in src/pairing. */
export type ReadChannelAllowFromStoreForAccount = (params: {
  channel: PairingChannel;
  accountId: string;
  env?: NodeJS.ProcessEnv;
}) => Promise<string[]>;

/** Shared type for Upsert Channel Pairing Request For Account in src/pairing. */
export type UpsertChannelPairingRequestForAccount = (params: {
  channel: PairingChannel;
  id: string | number;
  accountId: string;
  meta?: Record<string, string | undefined | null>;
  env?: NodeJS.ProcessEnv;
  pairingAdapter?: ChannelPairingAdapter;
}) => Promise<{ code: string; created: boolean }>;
