// Shared types for flows types behavior.
type FlowDocsLink = {
  path: string;
  label?: string;
};

type FlowContributionKind = "channel" | "core" | "provider" | "search";

type FlowContributionSurface = "auth-choice" | "health" | "model-picker" | "setup";

type FlowOptionGroup = {
  id: string;
  label: string;
  hint?: string;
};

/** Shared type for Flow Option in src/flows. */
export type FlowOption<Value extends string = string> = {
  value: Value;
  label: string;
  hint?: string;
  group?: FlowOptionGroup;
  docs?: FlowDocsLink;
  assistantPriority?: number;
  assistantVisibility?: "visible" | "manual-only";
};

/** Shared type for Flow Contribution in src/flows. */
export type FlowContribution<Value extends string = string> = {
  id: string;
  kind: FlowContributionKind;
  surface: FlowContributionSurface;
  option: FlowOption<Value>;
  source?: string;
};

/** Reused helper for sort Flow Contributions By Label behavior in src/flows. */
export function sortFlowContributionsByLabel<T extends FlowContribution>(
  contributions: readonly T[],
): T[] {
  return [...contributions].toSorted(
    (left, right) =>
      left.option.label.localeCompare(right.option.label) ||
      left.option.value.localeCompare(right.option.value),
  );
}
