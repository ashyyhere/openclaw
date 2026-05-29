/** Idempotency key builders for child-run announce delivery. */
type AnnounceIdFromChildRunParams = {
  childSessionKey: string;
  childRunId: string;
};

/** Build a stable announce id from child session/run identity. */
export function buildAnnounceIdFromChildRun(params: AnnounceIdFromChildRunParams): string {
  return `v1:${params.childSessionKey}:${params.childRunId}`;
}

/** Build the queue idempotency key for an announce id. */
export function buildAnnounceIdempotencyKey(announceId: string): string {
  return `announce:${announceId}`;
}
