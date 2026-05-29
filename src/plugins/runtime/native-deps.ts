// plugins/runtime native deps helpers and runtime behavior.
/** Shared type for Native Dependency Hint Params in src/plugins/runtime. */
export type NativeDependencyHintParams = {
  packageName: string;
  manager?: "pnpm" | "npm" | "yarn";
  rebuildCommand?: string;
  approveBuildsCommand?: string;
  downloadCommand?: string;
};

/** Reused helper for format Native Dependency Hint behavior in src/plugins/runtime. */
export function formatNativeDependencyHint(params: NativeDependencyHintParams): string {
  const manager = params.manager ?? "pnpm";
  const rebuildCommand =
    params.rebuildCommand ??
    (manager === "npm"
      ? `npm rebuild ${params.packageName}`
      : manager === "yarn"
        ? `yarn rebuild ${params.packageName}`
        : `pnpm rebuild ${params.packageName}`);
  const approveBuildsCommand =
    params.approveBuildsCommand ??
    (manager === "pnpm" ? `pnpm approve-builds (select ${params.packageName})` : undefined);
  const steps = [approveBuildsCommand, rebuildCommand, params.downloadCommand].filter(
    (step): step is string => Boolean(step),
  );
  if (steps.length === 0) {
    return `Install ${params.packageName} and rebuild its native module.`;
  }
  return `Install ${params.packageName} and rebuild its native module (${steps.join("; ")}).`;
}
