// Identifies remote media URLs that should pass through instead of being treated as local paths.
const HTTP_URL_RE = /^https?:\/\//i;
const MXC_URL_RE = /^mxc:\/\//i;

/** Checks whether a media source is an HTTP(S) or Matrix MXC URL. */
export function isPassThroughRemoteMediaSource(value: string | null | undefined): boolean {
  const normalized = value?.trim() ?? "";
  return Boolean(normalized) && (HTTP_URL_RE.test(normalized) || MXC_URL_RE.test(normalized));
}
