// Compares node approval and permission surfaces after canonical normalization.
import { normalizeArrayBackedTrimmedStringList } from "../shared/string-normalization.js";

/** Normalize an approval-surface list to the canonical trimmed string array. */
export function normalizeNodeApprovalSurfaceList(value: readonly string[] | undefined): string[] {
  return normalizeArrayBackedTrimmedStringList(value) ?? [];
}

/** Compare approval-surface lists as unordered canonical sets. */
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

/** Compare permission-surface maps with deterministic key ordering. */
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
