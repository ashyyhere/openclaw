// Chat attachment accept/filter helpers. Video attachments are excluded from the
// current composer even when the browser provides a generic file type.
/** Browser file input accept string for supported chat attachments. */
export const CHAT_ATTACHMENT_ACCEPT =
  "image/*,audio/*,application/pdf,text/*,.csv,.json,.md,.txt,.zip," +
  ".doc,.docx,.xls,.xlsx,.ppt,.pptx";

/** Return whether a MIME type is supported by chat attachments. */
export function isSupportedChatAttachmentMimeType(mimeType: string | null | undefined): boolean {
  return typeof mimeType === "string" && !mimeType.startsWith("video/");
}

/** Return whether a selected file is supported by chat attachments. */
export function isSupportedChatAttachmentFile(file: Pick<File, "name" | "type">): boolean {
  if (file.type.startsWith("video/")) {
    return false;
  }
  return !/\.(?:avi|m4v|mov|mp4|mpeg|mpg|webm)$/i.test(file.name);
}
