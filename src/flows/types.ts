// Shared setup-flow contribution types and sorting helper.
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

/** Selectable option contributed to a setup flow surface. */
export type FlowOption<Value extends string = string> = {
  value: Value;
  label: string;
  hint?: string;
  group?: FlowOptionGroup;
  docs?: FlowDocsLink;
  assistantPriority?: number;
  assistantVisibility?: "visible" | "manual-only";
};

/** Contribution from a core/plugin flow into a setup surface. */
export type FlowContribution<Value extends string = string> = {
  id: string;
  kind: FlowContributionKind;
  surface: FlowContributionSurface;
  option: FlowOption<Value>;
  source?: string;
};

/** Sort setup-flow contributions by display label and stable value. */
export function sortFlowContributionsByLabel<T extends FlowContribution>(
  contributions: readonly T[],
): T[] {
  return [...contributions].toSorted(
    (left, right) =>
      left.option.label.localeCompare(right.option.label) ||
      left.option.value.localeCompare(right.option.value),
  );
}
