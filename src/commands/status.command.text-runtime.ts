/** Runtime text-formatting re-exports for status command output. */
export { formatCliCommand } from "../cli/command-format.js";
/** Status command logging helper used by text runtime renderers. */
export { info } from "../globals.js";
/** Relative time formatter used in status timestamps. */
export { formatTimeAgo } from "../infra/format-time/format-relative.ts";
/** Formats git install source labels for update/status output. */
export { formatGitInstallLabel } from "../infra/update-check.js";
/** Memory cache/vector/FTS status summarizers. */
export {
  resolveMemoryCacheSummary,
  resolveMemoryFtsState,
  resolveMemoryVectorState,
} from "../memory-host-sdk/status.js";
/** Plugin compatibility summary formatters for status output. */
export {
  formatPluginCompatibilityNotice,
  summarizePluginCompatibility,
} from "../plugins/status.js";
export { getTerminalTableWidth, renderTable } from "../../packages/terminal-core/src/table.js";
export { theme } from "../../packages/terminal-core/src/theme.js";
export { formatHealthChannelLines } from "./health-format.js";
/** Groups channel issues for status-all channel rendering. */
export { groupChannelIssuesByChannel } from "./status-all/channel-issues.js";
/** Channel table row and column builders for status-all output. */
export {
  buildStatusChannelsTableRows,
  statusChannelsTableColumns,
} from "./status-all/channels-table.js";
/** Overview, gateway, update, and service formatters for status surfaces. */
export {
  buildStatusGatewaySurfaceValues,
  buildStatusOverviewSurfaceRows,
  buildStatusOverviewRows,
  buildStatusUpdateSurface,
  buildGatewayStatusSummaryParts,
  formatStatusDashboardValue,
  formatGatewayAuthUsed,
  formatGatewaySelfSummary,
  resolveStatusUpdateChannelInfo,
  formatStatusServiceValue,
  formatStatusTailscaleValue,
  resolveStatusDashboardUrl,
} from "./status-all/format.js";
/** Compact duration, token, cache, and text formatters for status output. */
export {
  formatDuration,
  formatKTokens,
  formatPromptCacheCompact,
  formatTokensCompact,
  shortenText,
} from "./status.format.js";
/** Formats the update-available hint shown in status output. */
export { formatUpdateAvailableHint } from "./status.update.js";
