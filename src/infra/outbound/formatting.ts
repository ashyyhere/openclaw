// Shared outbound message formatting limits and parse options.
import type { ChunkMode } from "../../auto-reply/chunk.js";
import type { MarkdownTableMode } from "../../config/types.js";

/** Formatting controls applied while chunking and rendering outbound messages. */
export type OutboundDeliveryFormattingOptions = {
  textLimit?: number;
  maxLinesPerMessage?: number;
  tableMode?: MarkdownTableMode;
  chunkMode?: ChunkMode;
  parseMode?: "HTML";
};
