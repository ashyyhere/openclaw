// Runtime import contracts for fast abort handling.
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { FinalizedMsgContext } from "../templating.js";

/** Shared type for Fast Abort Result in src/auto-reply/reply. */
export type FastAbortResult = {
  handled: boolean;
  aborted: boolean;
  stoppedSubagents?: number;
};

/** Shared type for Try Fast Abort From Message in src/auto-reply/reply. */
export type TryFastAbortFromMessage = (params: {
  ctx: FinalizedMsgContext;
  cfg: OpenClawConfig;
}) => Promise<FastAbortResult>;

/** Shared type for Format Abort Reply Text in src/auto-reply/reply. */
export type FormatAbortReplyText = (stoppedSubagents?: number) => string;
