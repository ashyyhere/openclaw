// Channel directory adapter composition helpers.
import type { ChannelDirectoryAdapter } from "./types.adapters.js";

/** Reused constant for null Channel Directory Self behavior in src/channels/plugins. */
export const nullChannelDirectorySelf: NonNullable<ChannelDirectoryAdapter["self"]> = async () =>
  null;

/** Reused constant for empty Channel Directory List behavior in src/channels/plugins. */
export const emptyChannelDirectoryList: NonNullable<
  ChannelDirectoryAdapter["listPeers"]
> = async () => [];

/** Build a channel directory adapter with a null self resolver by default. */
export function createChannelDirectoryAdapter(
  params: Omit<ChannelDirectoryAdapter, "self"> & {
    self?: ChannelDirectoryAdapter["self"];
  } = {},
): ChannelDirectoryAdapter {
  return {
    self: params.self ?? nullChannelDirectorySelf,
    ...params,
  };
}

/** Build the common empty directory surface for channels without directory support. */
export function createEmptyChannelDirectoryAdapter(): ChannelDirectoryAdapter {
  return createChannelDirectoryAdapter({
    listPeers: emptyChannelDirectoryList,
    listGroups: emptyChannelDirectoryList,
  });
}
