// Thinking-level label helpers for session/model override controls.
import { normalizeLowercaseStringOrEmpty } from "./string-coerce.ts";
import { normalizeThinkLevel } from "./thinking.ts";

/** Normalize a thinking option value before comparing or displaying it. */
export function normalizeThinkingOptionValue(raw: string): string {
  return normalizeThinkLevel(raw) ?? normalizeLowercaseStringOrEmpty(raw);
}

/** Format the inherited thinking level shown in override dropdowns. */
export function formatInheritedThinkingLabel(effectiveLevel: string | null | undefined): string {
  const normalized = effectiveLevel ? normalizeThinkingOptionValue(effectiveLevel) : "off";
  return `Inherited: ${formatThinkingLevelDisplayLabel(normalized)}`;
}

/** Format one explicit thinking override value for display. */
export function formatThinkingOverrideLabel(value: string, label?: string | null): string {
  const normalized = normalizeThinkingOptionValue(value);
  if (!normalized || normalized === "off") {
    return "Off";
  }
  return formatThinkingLevelDisplayLabel(label?.trim() || normalized);
}

function formatThinkingLevelDisplayLabel(value: string): string {
  const raw = normalizeLowercaseStringOrEmpty(value);
  if (["on", "enable", "enabled"].includes(raw)) {
    return "On";
  }
  const normalized = normalizeThinkingOptionValue(value);
  switch (normalized) {
    case "adaptive":
      return "Adaptive";
    case "minimal":
      return "Minimal";
    case "low":
      return "Low";
    case "medium":
      return "Medium";
    case "high":
      return "High";
    case "xhigh":
      return "Extra high";
    case "max":
      return "Maximum";
    default:
      return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
