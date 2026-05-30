/** Shared option types for embedded-agent subscription formatting. */
import type { BlockReplyChunking } from "./embedded-agent-block-chunker.js";

/** Format used when emitting tool results to users. */
export type ToolResultFormat = "markdown" | "plain";
/** Level of detail used for tool progress messages. */
export type ToolProgressDetailMode = "explain" | "raw";

/** Chunking mode shared by embedded subscription output and block chunkers. */
export type { BlockReplyChunking };
