// Outbound attachment resolver that loads web media and writes it to the media store.
import { buildOutboundMediaLoadOptions, type OutboundMediaAccess } from "./load-options.js";
import { saveMediaBuffer } from "./store.js";
import { loadWebMedia } from "./web-media.js";

/** Resolves a remote or allowed local media URL into a stored outbound file path. */
export async function resolveOutboundAttachmentFromUrl(
  mediaUrl: string,
  maxBytes: number,
  options?: {
    mediaAccess?: OutboundMediaAccess;
    localRoots?: readonly string[];
    readFile?: (filePath: string) => Promise<Buffer>;
  },
): Promise<{ path: string; contentType?: string }> {
  const media = await loadWebMedia(
    mediaUrl,
    buildOutboundMediaLoadOptions({
      maxBytes,
      mediaAccess: options?.mediaAccess,
      mediaLocalRoots: options?.localRoots,
      mediaReadFile: options?.readFile,
    }),
  );
  const saved = await saveMediaBuffer(
    media.buffer,
    media.contentType ?? undefined,
    "outbound",
    maxBytes,
    media.fileName,
  );
  return { path: saved.path, contentType: saved.contentType };
}
