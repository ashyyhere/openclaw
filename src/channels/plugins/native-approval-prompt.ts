// Native approval prompt formatting for channel plugins.
import { normalizeOptionalLowercaseString } from "../../shared/string-coerce.js";
import { resolveChannelApprovalCapability } from "./approvals.js";
import type { ChannelPlugin } from "./types.plugin.js";

/** Reused constant for NATIVE APPROVAL PROMPT RUNTIME CAPABILITY behavior in src/channels/plugins. */
export const NATIVE_APPROVAL_PROMPT_RUNTIME_CAPABILITY = "nativeApprovals";

const NATIVE_APPROVAL_PROMPT_RUNTIME_CAPABILITY_NORMALIZED = "nativeapprovals";

// Keep prompt construction lightweight. Full plugin loading is too expensive on
// prompt-only import paths; plugin-backed checks still cover loaded native
// channels at runtime.
const KNOWN_NATIVE_APPROVAL_PROMPT_CHANNELS = new Set([
  "discord",
  "matrix",
  "qqbot",
  "slack",
  "telegram",
  "signal",
]);

/** Reused helper for channel Plugin Has Native Approval Prompt Ui behavior in src/channels/plugins. */
export function channelPluginHasNativeApprovalPromptUi(
  plugin?: Pick<ChannelPlugin, "approvalCapability"> | null,
): boolean {
  const capability = resolveChannelApprovalCapability(plugin);
  return Boolean(capability?.native || capability?.nativeRuntime);
}

/** Reused helper for is Known Native Approval Prompt Channel behavior in src/channels/plugins. */
export function isKnownNativeApprovalPromptChannel(channel?: string | null): boolean {
  const normalized = normalizeOptionalLowercaseString(channel);
  return Boolean(normalized && KNOWN_NATIVE_APPROVAL_PROMPT_CHANNELS.has(normalized));
}

/** Reused helper for has Native Approval Prompt Runtime Capability behavior in src/channels/plugins. */
export function hasNativeApprovalPromptRuntimeCapability(
  capabilities?: readonly string[] | null,
): boolean {
  return Boolean(
    capabilities?.some(
      (capability) =>
        normalizeOptionalLowercaseString(capability) ===
        NATIVE_APPROVAL_PROMPT_RUNTIME_CAPABILITY_NORMALIZED,
    ),
  );
}
