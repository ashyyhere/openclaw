/** Shared types for effective tool inventory reporting. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ProviderRuntimeModel } from "../plugins/provider-runtime-model.types.js";

/** Source bucket used when presenting the tools actually available to an agent. */
export type EffectiveToolSource = "core" | "plugin" | "channel" | "mcp";

/** Single normalized tool entry after policy, plugin, and channel filtering. */
export type EffectiveToolInventoryEntry = {
  id: string;
  label: string;
  description: string;
  rawDescription: string;
  source: EffectiveToolSource;
  pluginId?: string;
  channelId?: string;
  risk?: "low" | "medium" | "high";
  tags?: string[];
};

/** Group of effective tools with the same source bucket. */
export type EffectiveToolInventoryGroup = {
  id: EffectiveToolSource;
  label: string;
  source: EffectiveToolSource;
  tools: EffectiveToolInventoryEntry[];
};

/** Informational or warning note emitted while resolving effective tools. */
export type EffectiveToolInventoryNotice = {
  id: string;
  severity: "info" | "warning";
  message: string;
};

/** Complete tool inventory result for one agent/profile view. */
export type EffectiveToolInventoryResult = {
  agentId: string;
  profile: string;
  groups: EffectiveToolInventoryGroup[];
  notices?: EffectiveToolInventoryNotice[];
};

/** Inputs needed to resolve the tools visible for a session and model context. */
export type ResolveEffectiveToolInventoryParams = {
  cfg: OpenClawConfig;
  agentId?: string;
  sessionKey?: string;
  workspaceDir?: string;
  agentDir?: string;
  messageProvider?: string;
  senderId?: string | null;
  senderName?: string | null;
  senderUsername?: string | null;
  senderE164?: string | null;
  accountId?: string | null;
  modelProvider?: string;
  modelId?: string;
  modelApi?: string | null;
  runtimeModel?: ProviderRuntimeModel;
  currentChannelId?: string;
  currentThreadTs?: string;
  currentMessageId?: string | number;
  groupId?: string | null;
  groupChannel?: string | null;
  groupSpace?: string | null;
  replyToMode?: "off" | "first" | "all" | "batched";
  modelHasVision?: boolean;
  requireExplicitMessageTarget?: boolean;
  disableMessageTool?: boolean;
};
