/** Shared coercion and matching helpers for tool policy modules. */
import { normalizeLowercaseStringOrEmpty } from "../shared/string-coerce.js";
import { uniqueStrings } from "../shared/string-normalization.js";
import {
  CORE_TOOL_GROUPS,
  resolveCoreToolProfilePolicy,
  type ToolProfileId,
} from "./tool-catalog.js";

type ToolProfilePolicy = {
  allow?: string[];
  deny?: string[];
};

const TOOL_NAME_ALIASES: Record<string, string> = {
  bash: "exec",
  "apply-patch": "apply_patch",
};

/** Reused constant for TOOL GROUPS behavior in src/agents. */
export const TOOL_GROUPS: Record<string, string[]> = { ...CORE_TOOL_GROUPS };

/** Reused helper for normalize Tool Name behavior in src/agents. */
export function normalizeToolName(name: string) {
  const normalized = normalizeLowercaseStringOrEmpty(name);
  return TOOL_NAME_ALIASES[normalized] ?? normalized;
}

/** Reused helper for normalize Tool List behavior in src/agents. */
export function normalizeToolList(list?: string[]) {
  if (!list) {
    return [];
  }
  return list.map(normalizeToolName).filter(Boolean);
}

/** Reused helper for expand Tool Groups behavior in src/agents. */
export function expandToolGroups(list?: string[]) {
  const normalized = normalizeToolList(list);
  const expanded: string[] = [];
  for (const value of normalized) {
    const group = TOOL_GROUPS[value];
    if (group) {
      expanded.push(...group);
      continue;
    }
    expanded.push(value);
  }
  return uniqueStrings(expanded);
}

/** Reused helper for resolve Tool Profile Policy behavior in src/agents. */
export function resolveToolProfilePolicy(profile?: string): ToolProfilePolicy | undefined {
  return resolveCoreToolProfilePolicy(profile);
}

/** Re-exported API for src/agents, starting with Tool Profile Id. */
export type { ToolProfileId };
