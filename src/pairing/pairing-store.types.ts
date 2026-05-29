// Pairing store callback types shared by channel plugins and pairing commands.
import type { ChannelId } from "../channels/plugins/channel-id.types.js";
import type { ChannelPairingAdapter } from "../channels/plugins/pairing.types.js";

/** Channel id accepted by pairing persistence helpers. */
export type PairingChannel = ChannelId;

/** Reads the allowed sender ids for a channel/account pair. */
export type ReadChannelAllowFromStoreForAccount = (params: {
  channel: PairingChannel;
  accountId: string;
  env?: NodeJS.ProcessEnv;
}) => Promise<string[]>;

/** Creates or refreshes a pending pairing request for a channel/account pair. */
export type UpsertChannelPairingRequestForAccount = (params: {
  channel: PairingChannel;
  id: string | number;
  accountId: string;
  meta?: Record<string, string | undefined | null>;
  env?: NodeJS.ProcessEnv;
  pairingAdapter?: ChannelPairingAdapter;
}) => Promise<{ code: string; created: boolean }>;
