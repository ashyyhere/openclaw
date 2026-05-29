/** Builds reusable pairing adapters for channel approval flows. */
import type { ChannelPairingAdapter } from "./types.adapters.js";

type PairingNotifyParams = Parameters<NonNullable<ChannelPairingAdapter["notifyApproval"]>>[0];

/** Reused helper for create Pairing Prefix Stripper behavior in src/channels/plugins. */
export function createPairingPrefixStripper(
  prefixRe: RegExp,
  map: (entry: string) => string = (entry) => entry,
): NonNullable<ChannelPairingAdapter["normalizeAllowEntry"]> {
  return (entry) => map(entry.trim().replace(prefixRe, "").trim());
}

/** Reused helper for create Logged Pairing Approval Notifier behavior in src/channels/plugins. */
export function createLoggedPairingApprovalNotifier(
  format: string | ((params: PairingNotifyParams) => string),
  log: (message: string) => void = console.log,
): NonNullable<ChannelPairingAdapter["notifyApproval"]> {
  return async (params) => {
    log(typeof format === "function" ? format(params) : format);
  };
}

/** Reused helper for create Text Pairing Adapter behavior in src/channels/plugins. */
export function createTextPairingAdapter(params: {
  idLabel: string;
  message: string;
  normalizeAllowEntry?: ChannelPairingAdapter["normalizeAllowEntry"];
  notify: (params: PairingNotifyParams & { message: string }) => Promise<void> | void;
}): ChannelPairingAdapter {
  return {
    idLabel: params.idLabel,
    normalizeAllowEntry: params.normalizeAllowEntry,
    notifyApproval: async (ctx) => {
      await params.notify({ ...ctx, message: params.message });
    },
  };
}
