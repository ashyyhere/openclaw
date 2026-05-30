import { asOptionalRecord } from "../shared/record-coerce.js";
import { normalizeOptionalString } from "../shared/string-coerce.js";

/** Accepted child-session spawn metadata returned by ACP tools. */
export type AcceptedSessionSpawn = {
  runId: string;
  childSessionKey: string;
};

/** Extract accepted spawn metadata from a tool result details object. */
export function normalizeAcceptedSessionSpawnResult(result: unknown): AcceptedSessionSpawn | null {
  const details = asOptionalRecord(asOptionalRecord(result)?.details);
  if (!details || details.status !== "accepted") {
    return null;
  }
  const runId = normalizeOptionalString(details.runId);
  const childSessionKey = normalizeOptionalString(details.childSessionKey);
  if (!runId || !childSessionKey) {
    return null;
  }
  return { runId, childSessionKey };
}

/** Return whether any normalized spawn result contains child session/run ids. */
export function hasAcceptedSessionSpawn(acceptedSessionSpawns?: readonly unknown[]): boolean {
  return (acceptedSessionSpawns ?? []).some((spawn) => {
    const record = asOptionalRecord(spawn);
    if (!record) {
      return false;
    }
    return Boolean(
      normalizeOptionalString(record.runId) && normalizeOptionalString(record.childSessionKey),
    );
  });
}
