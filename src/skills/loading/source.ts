/** Resolves telemetry/source labels for skill entries. */
import { normalizeOptionalString } from "../../shared/string-coerce.js";
import type { SkillTelemetrySource } from "../types.js";
import type { Skill } from "./skill-contract.js";

type SkillSourceCompat = Skill & {
  sourceInfo?: {
    source?: string;
  };
};

/** Resolves a human-readable source string for a skill. */
export function resolveSkillSource(skill: Skill): string {
  const compatSkill = skill as SkillSourceCompat;
  const canonical = normalizeOptionalString(compatSkill.source) ?? "";
  if (canonical) {
    return canonical;
  }
  const legacy = normalizeOptionalString(compatSkill.sourceInfo?.source) ?? "";
  return legacy || "unknown";
}

/** Normalizes raw telemetry source metadata. */
export function resolveSkillTelemetrySourceValue(value: unknown): SkillTelemetrySource {
  const source = normalizeOptionalString(value) ?? "";
  if (source === "bundled" || source === "openclaw-bundled") {
    return "bundled";
  }
  if (
    source === "workspace" ||
    source === "openclaw-workspace" ||
    source === "openclaw-managed" ||
    source === "openclaw-extra" ||
    source === "agents-skills-personal" ||
    source === "agents-skills-project"
  ) {
    return "workspace";
  }
  return "unknown";
}

/** Resolves the telemetry source bucket for a loaded skill. */
export function resolveSkillTelemetrySource(skill: Skill): SkillTelemetrySource {
  return resolveSkillTelemetrySourceValue(resolveSkillSource(skill));
}
