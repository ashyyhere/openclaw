// Native approval type contracts for channel plugins.
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ChannelApprovalKind } from "../../infra/approval-types.js";
import type { ExecApprovalRequest } from "../../infra/exec-approvals.js";
import type { PluginApprovalRequest } from "../../infra/plugin-approvals.js";

/** Shared type for Channel Approval Native Surface in src/channels/plugins. */
export type ChannelApprovalNativeSurface = "origin" | "approver-dm";

/** Shared type for Channel Approval Native Target in src/channels/plugins. */
export type ChannelApprovalNativeTarget = {
  to: string;
  threadId?: string | number | null;
};

/** Shared type for Channel Approval Native Delivery Preference in src/channels/plugins. */
export type ChannelApprovalNativeDeliveryPreference = ChannelApprovalNativeSurface | "both";

/** Shared type for Channel Approval Native Request in src/channels/plugins. */
export type ChannelApprovalNativeRequest = ExecApprovalRequest | PluginApprovalRequest;

/** Shared type for Channel Approval Native Delivery Capabilities in src/channels/plugins. */
export type ChannelApprovalNativeDeliveryCapabilities = {
  enabled: boolean;
  preferredSurface: ChannelApprovalNativeDeliveryPreference;
  supportsOriginSurface: boolean;
  supportsApproverDmSurface: boolean;
  notifyOriginWhenDmOnly?: boolean;
};

/** Shared type for Channel Approval Native Adapter in src/channels/plugins. */
export type ChannelApprovalNativeAdapter = {
  describeDeliveryCapabilities: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    approvalKind: ChannelApprovalKind;
    request: ChannelApprovalNativeRequest;
  }) => ChannelApprovalNativeDeliveryCapabilities;
  resolveOriginTarget?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    approvalKind: ChannelApprovalKind;
    request: ChannelApprovalNativeRequest;
  }) => ChannelApprovalNativeTarget | null | Promise<ChannelApprovalNativeTarget | null>;
  resolveApproverDmTargets?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    approvalKind: ChannelApprovalKind;
    request: ChannelApprovalNativeRequest;
  }) => ChannelApprovalNativeTarget[] | Promise<ChannelApprovalNativeTarget[]>;
};
