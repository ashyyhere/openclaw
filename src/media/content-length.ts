// Content-Length parsing for media downloads before buffer allocation.
/** Parse a media Content-Length header into a safe integer byte count. */
export function parseMediaContentLength(raw: string | null): number | null {
  if (raw === null) {
    return null;
  }
  const trimmed = raw.trim();
  if (!/^\d+$/.test(trimmed)) {
    throw new Error(`invalid content-length header: ${raw}`);
  }
  const size = Number(trimmed);
  if (!Number.isSafeInteger(size)) {
    throw new Error(`invalid content-length header: ${raw}`);
  }
  return size;
}
