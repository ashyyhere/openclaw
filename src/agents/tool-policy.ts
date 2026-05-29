/** Resolves high-level allow/deny policy for tool availability and execution. */
import { normalizeOptionalLowercaseString } from "../shared/string-coerce.js";
import { uniqueStrings } from "../shared/string-normalization.js";
import { IMPLICIT_ALLOW_ALL_FROM_ALSO_ALLOW } from "./sandbox-tool-policy.js";
import { expandToolGroups, normalizeToolList, normalizeToolName } from "./tool-policy-shared.js";
/** Re-exported API for src/agents. */
export {
  expandToolGroups,
  normalizeToolList,
  normalizeToolName,
  resolveToolProfilePolicy,
  TOOL_GROUPS,
} from "./tool-policy-shared.js";
/** Re-exported API for src/agents, starting with Tool Profile Id. */
export type { ToolProfileId } from "./tool-policy-shared.js";

/** Shared type for Tool Policy Like in src/agents. */
export type ToolPolicyLike = {
  allow?: string[];
  deny?: string[];
  [IMPLICIT_ALLOW_ALL_FROM_ALSO_ALLOW]?: true;
};

/** Shared type for Plugin Tool Groups in src/agents. */
export type PluginToolGroups = {
  all: string[];
  byPlugin: Map<string, string[]>;
};

/** Shared type for Allowlist Resolution in src/agents. */
export type AllowlistResolution = {
  policy: ToolPolicyLike | undefined;
  unknownAllowlist: string[];
  pluginOnlyAllowlist: boolean;
};

/** Reused constant for DEFAULT PLUGIN TOOLS ALLOWLIST ENTRY behavior in src/agents. */
export const DEFAULT_PLUGIN_TOOLS_ALLOWLIST_ENTRY = "__openclaw_default_plugin_tools__";

/** Reused helper for has Restrictive Allow Policy behavior in src/agents. */
export function hasRestrictiveAllowPolicy(policy?: { allow?: string[] }): boolean {
  return (
    Array.isArray(policy?.allow) &&
    policy.allow.some((entry) => {
      const normalized = normalizeToolName(entry);
      return (
        Boolean(normalized) &&
        normalized !== "*" &&
        normalized !== DEFAULT_PLUGIN_TOOLS_ALLOWLIST_ENTRY
      );
    })
  );
}

/** Reused helper for replace With Effective Tool Allowlist behavior in src/agents. */
export function replaceWithEffectiveToolAllowlist(
  target: string[],
  tools: Array<{ name: string }>,
): void {
  target.length = 0;
  const seen = new Set<string>();
  for (const tool of tools) {
    const normalized = normalizeToolName(tool.name);
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    target.push(normalized);
  }
}

/** Reused helper for collect Explicit Allowlist behavior in src/agents. */
export function collectExplicitAllowlist(policies: Array<ToolPolicyLike | undefined>): string[] {
  const entries: string[] = [];
  for (const policy of policies) {
    if (!policy?.allow) {
      continue;
    }
    for (const value of policy.allow) {
      if (typeof value !== "string") {
        continue;
      }
      const trimmed = value.trim();
      if (trimmed === "*" && policy[IMPLICIT_ALLOW_ALL_FROM_ALSO_ALLOW] === true) {
        continue;
      }
      if (trimmed) {
        entries.push(trimmed);
      }
    }
    if (policy[IMPLICIT_ALLOW_ALL_FROM_ALSO_ALLOW] === true) {
      entries.push(DEFAULT_PLUGIN_TOOLS_ALLOWLIST_ENTRY);
    }
  }
  return uniqueStrings(entries);
}

/** Reused helper for collect Explicit Denylist behavior in src/agents. */
export function collectExplicitDenylist(policies: Array<ToolPolicyLike | undefined>): string[] {
  const entries: string[] = [];
  for (const policy of policies) {
    if (!policy?.deny) {
      continue;
    }
    for (const value of policy.deny) {
      if (typeof value !== "string") {
        continue;
      }
      const trimmed = value.trim();
      if (trimmed) {
        entries.push(trimmed);
      }
    }
  }
  return entries;
}

/** Reused helper for build Plugin Tool Groups behavior in src/agents. */
export function buildPluginToolGroups<T extends { name: string }>(params: {
  tools: T[];
  toolMeta: (tool: T) => { pluginId: string } | undefined;
}): PluginToolGroups {
  const all: string[] = [];
  const byPlugin = new Map<string, string[]>();
  for (const tool of params.tools) {
    const meta = params.toolMeta(tool);
    if (!meta) {
      continue;
    }
    const name = normalizeToolName(tool.name);
    all.push(name);
    const pluginId = normalizeOptionalLowercaseString(meta.pluginId);
    if (!pluginId) {
      continue;
    }
    const list = byPlugin.get(pluginId) ?? [];
    list.push(name);
    byPlugin.set(pluginId, list);
  }
  return { all, byPlugin };
}

/** Reused helper for expand Plugin Groups behavior in src/agents. */
export function expandPluginGroups(
  list: string[] | undefined,
  groups: PluginToolGroups,
): string[] | undefined {
  if (!list || list.length === 0) {
    return list;
  }
  const expanded: string[] = [];
  for (const entry of list) {
    const normalized = normalizeToolName(entry);
    if (normalized === "group:plugins") {
      if (groups.all.length > 0) {
        expanded.push(...groups.all);
      } else {
        expanded.push(normalized);
      }
      continue;
    }
    const tools = groups.byPlugin.get(normalized);
    if (tools && tools.length > 0) {
      expanded.push(...tools);
      continue;
    }
    expanded.push(normalized);
  }
  return uniqueStrings(expanded);
}

/** Reused helper for expand Policy With Plugin Groups behavior in src/agents. */
export function expandPolicyWithPluginGroups(
  policy: ToolPolicyLike | undefined,
  groups: PluginToolGroups,
): ToolPolicyLike | undefined {
  if (!policy) {
    return undefined;
  }
  return {
    allow: expandPluginGroups(policy.allow, groups),
    deny: expandPluginGroups(policy.deny, groups),
  };
}

/** Reused helper for analyze Allowlist By Tool Type behavior in src/agents. */
export function analyzeAllowlistByToolType(
  policy: ToolPolicyLike | undefined,
  groups: PluginToolGroups,
  coreTools: Set<string>,
): AllowlistResolution {
  if (!policy?.allow || policy.allow.length === 0) {
    return { policy, unknownAllowlist: [], pluginOnlyAllowlist: false };
  }
  const normalized = normalizeToolList(policy.allow);
  if (normalized.length === 0) {
    return { policy, unknownAllowlist: [], pluginOnlyAllowlist: false };
  }
  const pluginIds = new Set(groups.byPlugin.keys());
  const pluginTools = new Set(groups.all);
  const unknownAllowlist: string[] = [];
  let hasOnlyPluginEntries = true;
  for (const entry of normalized) {
    if (entry === "*") {
      hasOnlyPluginEntries = false;
      continue;
    }
    const isPluginEntry =
      entry === "group:plugins" || pluginIds.has(entry) || pluginTools.has(entry);
    const expanded = expandToolGroups([entry]);
    const isCoreEntry = expanded.some((tool) => coreTools.has(tool));
    if (!isPluginEntry) {
      hasOnlyPluginEntries = false;
    }
    if (!isCoreEntry && !isPluginEntry) {
      unknownAllowlist.push(entry);
    }
  }
  const pluginOnlyAllowlist = hasOnlyPluginEntries;
  return {
    policy,
    unknownAllowlist: uniqueStrings(unknownAllowlist),
    pluginOnlyAllowlist,
  };
}

/** Reused helper for merge Also Allow Policy behavior in src/agents. */
export function mergeAlsoAllowPolicy<TPolicy extends { allow?: string[] }>(
  policy: TPolicy | undefined,
  alsoAllow?: string[],
): TPolicy | undefined {
  if (!policy?.allow || !Array.isArray(alsoAllow) || alsoAllow.length === 0) {
    return policy;
  }
  return { ...policy, allow: uniqueStrings([...policy.allow, ...alsoAllow]) };
}
