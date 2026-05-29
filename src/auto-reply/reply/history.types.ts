// Shared reply history entry types.
/** Shared type for History Entry in src/auto-reply/reply. */
export type HistoryEntry = {
  sender: string;
  body: string;
  timestamp?: number;
  messageId?: string;
  media?: HistoryMediaEntry[];
};

/** Shared type for History Media Entry in src/auto-reply/reply. */
export type HistoryMediaEntry = {
  path?: string;
  url?: string;
  contentType?: string;
  kind?: "image" | "video" | "audio" | "document" | "unknown";
  messageId?: string;
};
