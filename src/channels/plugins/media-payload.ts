// Channel media payload normalization helpers.
/** Shared type for Media Payload Input in src/channels/plugins. */
export type MediaPayloadInput = {
  path: string;
  contentType?: string;
};

/** Shared type for Media Payload in src/channels/plugins. */
export type MediaPayload = {
  MediaPath?: string;
  MediaType?: string;
  MediaUrl?: string;
  MediaPaths?: string[];
  MediaUrls?: string[];
  MediaTypes?: string[];
};

/** Reused helper for build Media Payload behavior in src/channels/plugins. */
export function buildMediaPayload(
  mediaList: MediaPayloadInput[],
  opts?: { preserveMediaTypeCardinality?: boolean },
): MediaPayload {
  const first = mediaList[0];
  const mediaPaths = mediaList.map((media) => media.path);
  const rawMediaTypes = mediaList.map((media) => media.contentType ?? "");
  const mediaTypes = opts?.preserveMediaTypeCardinality
    ? rawMediaTypes
    : rawMediaTypes.filter((value): value is string => Boolean(value));
  return {
    MediaPath: first?.path,
    MediaType: first?.contentType,
    MediaUrl: first?.path,
    MediaPaths: mediaPaths.length > 0 ? mediaPaths : undefined,
    MediaUrls: mediaPaths.length > 0 ? mediaPaths : undefined,
    MediaTypes: mediaTypes.length > 0 ? mediaTypes : undefined,
  };
}
