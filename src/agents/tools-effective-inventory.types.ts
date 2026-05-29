/** Shared types for effective tool inventory reporting. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ProviderRuntimeModel } from "../plugins/provider-runtime-model.types.js";

/** Shared type for Effective Tool Source in src/agents. */
export type EffectiveToolSource = "core" | "plugin" | "channel" | "mcp";

/** Shared type for Effective Tool Inventory Entry in src/agents. */
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

/** Shared type for Effective Tool Inventory Group in src/agents. */
export type EffectiveToolInventoryGroup = {
  id: EffectiveToolSource;
  label: string;
  source: EffectiveToolSource;
  tools: EffectiveToolInventoryEntry[];
};

/** Shared type for Effective Tool Inventory Notice in src/agents. */
export type EffectiveToolInventoryNotice = {
  id: string;
  severity: "info" | "warning";
  message: string;
};

/** Shared type for Effective Tool Inventory Result in src/agents. */
export type EffectiveToolInventoryResult = {
  agentId: string;
  profile: string;
  groups: EffectiveToolInventoryGroup[];
  notices?: EffectiveToolInventoryNotice[];
};

/** Shared type for Resolve Effective Tool Inventory Params in src/agents. */
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
