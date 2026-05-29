/** Runtime adapter object for status scan module dependencies. */
import { collectChannelStatusIssues } from "../infra/channels-status-issues.js";
import { buildChannelsTable } from "./status-all/channels.js";

/** Reused constant for status Scan Runtime behavior in src/commands. */
export const statusScanRuntime = {
  collectChannelStatusIssues,
  buildChannelsTable,
};
