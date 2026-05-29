/** Hydrates prepared snapshots with resolved skill entries when missing. */
type SnapshotWithRuntimeSkills = {
  resolvedSkills?: unknown;
};

type SnapshotRebuild<T extends SnapshotWithRuntimeSkills> = {
  resolvedSkills?: T["resolvedSkills"];
};

// resolvedSkills is runtime-only: session persistence keeps the lightweight
// catalog/prompt, while consumers that need concrete SKILL.md paths hydrate it
// from a fresh workspace scan.
/** Rebuilds a snapshot with resolved skills when no snapshot value exists. */
export function hydrateResolvedSkills<T extends SnapshotWithRuntimeSkills>(
  snapshot: T,
  rebuild: () => SnapshotRebuild<T>,
): T {
  if (snapshot.resolvedSkills !== undefined) {
    return snapshot;
  }
  return { ...snapshot, resolvedSkills: rebuild().resolvedSkills };
}

/** Async variant of resolved-skill snapshot hydration. */
export async function hydrateResolvedSkillsAsync<T extends SnapshotWithRuntimeSkills>(
  snapshot: T,
  rebuild: () => Promise<SnapshotRebuild<T>>,
): Promise<T> {
  if (snapshot.resolvedSkills !== undefined) {
    return snapshot;
  }
  return { ...snapshot, resolvedSkills: (await rebuild()).resolvedSkills };
}
