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

/** Named tool groups that expand into concrete tool allow/deny entries. */
export const TOOL_GROUPS: Record<string, string[]> = { ...CORE_TOOL_GROUPS };

/** Normalize a tool name and apply legacy aliases used in policy config. */
export function normalizeToolName(name: string) {
  const normalized = normalizeLowercaseStringOrEmpty(name);
  return TOOL_NAME_ALIASES[normalized] ?? normalized;
}

/** Normalize a configured list of tool names, dropping blank entries. */
export function normalizeToolList(list?: string[]) {
  if (!list) {
    return [];
  }
  return list.map(normalizeToolName).filter(Boolean);
}

/** Expand configured group names into their concrete tool names. */
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

/** Resolve a named tool profile into allow/deny lists. */
export function resolveToolProfilePolicy(profile?: string): ToolProfilePolicy | undefined {
  return resolveCoreToolProfilePolicy(profile);
}

/** Tool profile id union from the core tool catalog. */
export type { ToolProfileId };
