/** Runtime text-formatting re-exports for status command output. */
export { formatCliCommand } from "../cli/command-format.js";
/** Re-exported API for src/commands, starting with info. */
export { info } from "../globals.js";
/** Re-exported API for src/commands, starting with format Time Ago. */
export { formatTimeAgo } from "../infra/format-time/format-relative.ts";
/** Re-exported API for src/commands, starting with format Git Install Label. */
export { formatGitInstallLabel } from "../infra/update-check.js";
/** Re-exported API for src/commands. */
export {
  resolveMemoryCacheSummary,
  resolveMemoryFtsState,
  resolveMemoryVectorState,
} from "../memory-host-sdk/status.js";
/** Re-exported API for src/commands. */
export {
  formatPluginCompatibilityNotice,
  summarizePluginCompatibility,
} from "../plugins/status.js";
export { getTerminalTableWidth, renderTable } from "../../packages/terminal-core/src/table.js";
export { theme } from "../../packages/terminal-core/src/theme.js";
export { formatHealthChannelLines } from "./health-format.js";
/** Re-exported API for src/commands, starting with group Channel Issues By Channel. */
export { groupChannelIssuesByChannel } from "./status-all/channel-issues.js";
/** Re-exported API for src/commands. */
export {
  buildStatusChannelsTableRows,
  statusChannelsTableColumns,
} from "./status-all/channels-table.js";
/** Re-exported API for src/commands. */
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
/** Re-exported API for src/commands. */
export {
  formatDuration,
  formatKTokens,
  formatPromptCacheCompact,
  formatTokensCompact,
  shortenText,
} from "./status.format.js";
/** Re-exported API for src/commands, starting with format Update Available Hint. */
export { formatUpdateAvailableHint } from "./status.update.js";
