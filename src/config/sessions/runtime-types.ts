// Runtime callback and maintenance types shared by session store modules.
import type { MsgContext } from "../../auto-reply/templating.js";
import type { ChannelRouteRef } from "../../plugin-sdk/channel-route.js";
import type { DeliveryContext } from "../../utils/delivery-context.types.js";
import type { SessionMaintenanceMode } from "../types.base.js";
import type { SessionEntry, GroupKeyResolution } from "./types.js";

/** Read the last-updated timestamp for one session key from a store. */
export type ReadSessionUpdatedAt = (params: {
  storePath: string;
  sessionKey: string;
}) => number | undefined;

/** Warning payload emitted when session maintenance would prune or cap entries. */
export type SessionMaintenanceWarningRuntime = {
  activeSessionKey: string;
  activeUpdatedAt?: number;
  totalEntries: number;
  pruneAfterMs: number;
  maxEntries: number;
  wouldPrune: boolean;
  wouldCap: boolean;
};

/** Resolved session maintenance limits used at runtime. */
export type ResolvedSessionMaintenanceConfigRuntime = {
  mode: SessionMaintenanceMode;
  pruneAfterMs: number;
  maxEntries: number;
  resetArchiveRetentionMs: number | null;
  maxDiskBytes: number | null;
  highWaterBytes: number | null;
};

/** Report emitted after session maintenance mutates a store. */
export type SessionMaintenanceApplyReportRuntime = {
  mode: SessionMaintenanceMode;
  beforeCount: number;
  afterCount: number;
  pruned: number;
  capped: number;
  diskBudget: Record<string, unknown> | null;
};

/** Save options for maintenance, warnings, and ACP metadata preservation. */
export type SaveSessionStoreOptions = {
  skipMaintenance?: boolean;
  activeSessionKey?: string;
  allowDropAcpMetaSessionKeys?: string[];
  onWarn?: (warning: SessionMaintenanceWarningRuntime) => void | Promise<void>;
  onMaintenanceApplied?: (report: SessionMaintenanceApplyReportRuntime) => void | Promise<void>;
  maintenanceOverride?: Partial<ResolvedSessionMaintenanceConfigRuntime>;
};

/** Persist a session store with optional maintenance controls. */
export type SaveSessionStore = (
  storePath: string,
  store: Record<string, SessionEntry>,
  opts?: SaveSessionStoreOptions,
) => Promise<void>;

/** Record inbound message metadata onto a session entry. */
export type RecordSessionMetaFromInbound = (params: {
  storePath: string;
  sessionKey: string;
  ctx: MsgContext;
  groupResolution?: GroupKeyResolution | null;
  createIfMissing?: boolean;
}) => Promise<SessionEntry | null>;

/** Update the last outbound route and delivery context for a session. */
export type UpdateLastRoute = (params: {
  storePath: string;
  sessionKey: string;
  channel?: SessionEntry["lastChannel"];
  to?: string;
  accountId?: string;
  threadId?: string | number;
  route?: ChannelRouteRef;
  deliveryContext?: DeliveryContext;
  ctx?: MsgContext;
  groupResolution?: GroupKeyResolution | null;
  createIfMissing?: boolean;
}) => Promise<SessionEntry | null>;
