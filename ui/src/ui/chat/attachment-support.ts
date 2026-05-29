// ui/src/ui/chat attachment support helpers and runtime behavior.
/** Reused constant for CHAT ATTACHMENT ACCEPT behavior in ui/src/ui/chat. */
export const CHAT_ATTACHMENT_ACCEPT =
  "image/*,audio/*,application/pdf,text/*,.csv,.json,.md,.txt,.zip," +
  ".doc,.docx,.xls,.xlsx,.ppt,.pptx";

/** Reused helper for is Supported Chat Attachment Mime Type behavior in ui/src/ui/chat. */
export function isSupportedChatAttachmentMimeType(mimeType: string | null | undefined): boolean {
  return typeof mimeType === "string" && !mimeType.startsWith("video/");
}

/** Reused helper for is Supported Chat Attachment File behavior in ui/src/ui/chat. */
export function isSupportedChatAttachmentFile(file: Pick<File, "name" | "type">): boolean {
  if (file.type.startsWith("video/")) {
    return false;
  }
  return !/\.(?:avi|m4v|mov|mp4|mpeg|mpg|webm)$/i.test(file.name);
}
