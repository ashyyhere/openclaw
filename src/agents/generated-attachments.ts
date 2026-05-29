/** Formats generated media attachments for prompts and reply payloads. */
import { basenameFromAnyPath } from "../media/file-name.js";
import { normalizeOptionalString } from "../shared/string-coerce.js";
import { uniqueStrings } from "../shared/string-normalization.js";

/** Generated attachment metadata passed between child and parent tasks. */
export type AgentGeneratedAttachment = {
  type?: "image" | "audio" | "video" | "file";
  path?: string;
  url?: string;
  mediaUrl?: string;
  filePath?: string;
  mimeType?: string;
  name?: string;
};

/** Build a stable generated-attachment reference token. */
export function generatedAttachmentReference(
  attachment: AgentGeneratedAttachment,
): string | undefined {
  return normalizeOptionalString(
    attachment.path ?? attachment.url ?? attachment.mediaUrl ?? attachment.filePath,
  );
}

/** Extract media URLs from generated attachments. */
export function mediaUrlsFromGeneratedAttachments(
  attachments: readonly AgentGeneratedAttachment[] | undefined,
): string[] {
  return uniqueStrings(
    attachments?.flatMap((attachment) => generatedAttachmentReference(attachment) ?? []) ?? [],
  );
}

/** Resolve a display name for a generated attachment. */
export function nameFromGeneratedAttachment(
  attachment: AgentGeneratedAttachment,
): string | undefined {
  return (
    normalizeOptionalString(attachment.name) ??
    basenameFromAnyPath(generatedAttachmentReference(attachment) ?? "")
  );
}

/** Format generated attachment lines for internal prompt context. */
export function formatGeneratedAttachmentLines(
  attachments: readonly AgentGeneratedAttachment[] | undefined,
): string[] {
  if (!attachments?.length) {
    return [];
  }
  const lines = ["Attachments:"];
  for (const [index, attachment] of attachments.entries()) {
    const parts = [`${index + 1}.`];
    const type = normalizeOptionalString(attachment.type);
    const name = nameFromGeneratedAttachment(attachment);
    const mimeType = normalizeOptionalString(attachment.mimeType);
    const path = normalizeOptionalString(attachment.path ?? attachment.filePath);
    const url = normalizeOptionalString(attachment.url ?? attachment.mediaUrl);
    if (type) {
      parts.push(`type=${type}`);
    }
    if (name) {
      parts.push(`name=${JSON.stringify(name)}`);
    }
    if (mimeType) {
      parts.push(`mimeType=${mimeType}`);
    }
    if (path) {
      parts.push(`path=${JSON.stringify(path)}`);
    } else if (url) {
      parts.push(`mediaUrl=${JSON.stringify(url)}`);
    }
    lines.push(parts.join(" "));
  }
  return lines;
}
