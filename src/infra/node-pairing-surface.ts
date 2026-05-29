// infra node pairing surface helpers and runtime behavior.
import { normalizeArrayBackedTrimmedStringList } from "../shared/string-normalization.js";

/** Reused helper for normalize Node Approval Surface List behavior in src/infra. */
export function normalizeNodeApprovalSurfaceList(value: readonly string[] | undefined): string[] {
  return normalizeArrayBackedTrimmedStringList(value) ?? [];
}

/** Reused helper for same Node Approval Surface Set behavior in src/infra. */
export function sameNodeApprovalSurfaceSet(
  left: readonly string[] | undefined,
  right: readonly string[] | undefined,
): boolean {
  const normalizedLeft = new Set(normalizeNodeApprovalSurfaceList(left));
  const normalizedRight = new Set(normalizeNodeApprovalSurfaceList(right));
  if (normalizedLeft.size !== normalizedRight.size) {
    return false;
  }
  for (const entry of normalizedLeft) {
    if (!normalizedRight.has(entry)) {
      return false;
    }
  }
  return true;
}

/** Reused helper for same Node Permission Surface behavior in src/infra. */
export function sameNodePermissionSurface(
  left: Record<string, boolean> | undefined,
  right: Record<string, boolean> | undefined,
): boolean {
  const leftEntries = Object.entries(left ?? {}).toSorted(([leftKey], [rightKey]) =>
    leftKey.localeCompare(rightKey),
  );
  const rightEntries = Object.entries(right ?? {}).toSorted(([leftKey], [rightKey]) =>
    leftKey.localeCompare(rightKey),
  );
  if (leftEntries.length !== rightEntries.length) {
    return false;
  }
  return leftEntries.every(([key, value], index) => {
    const rightEntry = rightEntries[index];
    return rightEntry !== undefined && rightEntry[0] === key && rightEntry[1] === value;
  });
}
