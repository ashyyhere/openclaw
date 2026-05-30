/** Formats chat notices when approval prompts route to native surfaces elsewhere. */
import { formatHumanList } from "../shared/human-list.js";
import { sortUniqueStrings } from "../shared/string-normalization.js";
import type { ChannelApprovalNativePlannedTarget } from "./approval-native-delivery.js";

/** Describe a delivered approval destination without exposing per-target internals. */
export function describeApprovalDeliveryDestination(params: {
  channelLabel: string;
  deliveredTargets: readonly ChannelApprovalNativePlannedTarget[];
}): string {
  const surfaces = new Set(params.deliveredTargets.map((target) => target.surface));
  return surfaces.size === 1 && surfaces.has("approver-dm")
    ? `${params.channelLabel} DMs`
    : params.channelLabel;
}

/** Build the notice shown when approval was sent to another chat or DM surface. */
export function resolveApprovalRoutedElsewhereNoticeText(
  destinations: readonly string[],
): string | null {
  const uniqueDestinations = sortUniqueStrings(destinations.map((value) => value.trim())).filter(
    Boolean,
  );
  if (uniqueDestinations.length === 0) {
    return null;
  }
  return `Approval required. I sent the approval request to ${formatHumanList(
    uniqueDestinations,
  )}, not this chat.`;
}

/** Build fallback slash-command instructions when native approval delivery fails. */
export function resolveApprovalDeliveryFailedNoticeText(params: {
  approvalId: string;
  approvalKind: "exec" | "plugin";
  allowedDecisions?: readonly string[];
}): string {
  const commandId =
    params.approvalKind === "exec" && params.approvalId.length > 8
      ? params.approvalId.slice(0, 8)
      : params.approvalId;
  const decisions = (
    params.allowedDecisions?.length
      ? params.allowedDecisions
      : ["allow-once", "allow-always", "deny"]
  ).join("|");
  return [
    "Approval required. I could not deliver the native approval request.",
    `Reply with: /approve ${commandId} ${decisions}`,
    "If the short code is ambiguous, use the full id in /approve.",
  ].join("\n");
}
