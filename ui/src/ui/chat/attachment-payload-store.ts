// ui/src/ui/chat attachment payload store helpers and runtime behavior.
import type { ChatAttachment } from "../ui-types.ts";

type AttachmentPayload = {
  dataUrl?: string;
  previewUrl?: string;
};

const payloads = new Map<string, AttachmentPayload>();

function createObjectUrl(file: File): string | undefined {
  if (typeof URL === "undefined" || typeof URL.createObjectURL !== "function") {
    return undefined;
  }
  return URL.createObjectURL(file);
}

function revokeObjectUrl(url: string | undefined): void {
  if (!url || typeof URL === "undefined" || typeof URL.revokeObjectURL !== "function") {
    return;
  }
  URL.revokeObjectURL(url);
}

/** Reused helper for register Chat Attachment Payload behavior in ui/src/ui/chat. */
export function registerChatAttachmentPayload(params: {
  attachment: ChatAttachment;
  dataUrl: string;
  file: File;
}): ChatAttachment {
  const previous = payloads.get(params.attachment.id);
  revokeObjectUrl(previous?.previewUrl);
  const objectUrl = createObjectUrl(params.file);
  const previewUrl = objectUrl ?? params.attachment.previewUrl;
  payloads.set(params.attachment.id, {
    dataUrl: params.dataUrl,
    ...(previewUrl ? { previewUrl } : {}),
  });
  return {
    ...params.attachment,
    ...(previewUrl ? { previewUrl } : {}),
  };
}

/** Reused helper for get Chat Attachment Data Url behavior in ui/src/ui/chat. */
export function getChatAttachmentDataUrl(attachment: ChatAttachment): string | null {
  return attachment.dataUrl ?? payloads.get(attachment.id)?.dataUrl ?? null;
}

/** Reused helper for get Chat Attachment Preview Url behavior in ui/src/ui/chat. */
export function getChatAttachmentPreviewUrl(attachment: ChatAttachment): string | null {
  return (
    attachment.previewUrl ?? payloads.get(attachment.id)?.previewUrl ?? attachment.dataUrl ?? null
  );
}

function cloneChatAttachmentMetadata(attachment: ChatAttachment): ChatAttachment {
  const { dataUrl: _dataUrl, ...metadata } = attachment;
  return metadata;
}

/** Reused helper for clone Chat Attachments Metadata behavior in ui/src/ui/chat. */
export function cloneChatAttachmentsMetadata(
  attachments: readonly ChatAttachment[],
): ChatAttachment[] {
  return attachments.map(cloneChatAttachmentMetadata);
}

/** Reused helper for release Chat Attachment Payload behavior in ui/src/ui/chat. */
export function releaseChatAttachmentPayload(id: string): void {
  const payload = payloads.get(id);
  if (!payload) {
    return;
  }
  revokeObjectUrl(payload.previewUrl);
  payloads.delete(id);
}

/** Reused helper for release Chat Attachment Payloads behavior in ui/src/ui/chat. */
export function releaseChatAttachmentPayloads(attachments: readonly ChatAttachment[] = []): void {
  for (const attachment of attachments) {
    releaseChatAttachmentPayload(attachment.id);
  }
}

function discardChatAttachmentDataUrl(id: string): void {
  const payload = payloads.get(id);
  if (!payload) {
    return;
  }
  if (payload.previewUrl) {
    payloads.set(id, { previewUrl: payload.previewUrl });
    return;
  }
  payloads.delete(id);
}

/** Reused helper for discard Chat Attachment Data Urls behavior in ui/src/ui/chat. */
export function discardChatAttachmentDataUrls(attachments: readonly ChatAttachment[] = []): void {
  for (const attachment of attachments) {
    discardChatAttachmentDataUrl(attachment.id);
  }
}

/** Reused helper for reset Chat Attachment Payload Store For Test behavior in ui/src/ui/chat. */
export function resetChatAttachmentPayloadStoreForTest(): void {
  for (const payload of payloads.values()) {
    revokeObjectUrl(payload.previewUrl);
  }
  payloads.clear();
}
