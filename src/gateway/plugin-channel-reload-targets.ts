// gateway plugin channel reload targets helpers and runtime behavior.
import type { ChannelId } from "../channels/plugins/index.js";
import { normalizeOptionalString } from "../shared/string-coerce.js";

/** Shared type for Channel Plugin Reload Target in src/gateway. */
export type ChannelPluginReloadTarget = {
  channelId: ChannelId;
  pluginId?: string | null;
  aliases?: readonly string[] | null;
};

function addNormalizedTarget(targets: Set<string>, value: string | null | undefined): void {
  const normalized = normalizeOptionalString(value);
  if (normalized) {
    targets.add(normalized);
  }
}

/** Reused helper for list Channel Plugin Config Target Ids behavior in src/gateway. */
export function listChannelPluginConfigTargetIds(
  target: ChannelPluginReloadTarget,
): ReadonlySet<string> {
  const targets = new Set<string>();
  addNormalizedTarget(targets, target.channelId);
  addNormalizedTarget(targets, target.pluginId);
  for (const alias of target.aliases ?? []) {
    addNormalizedTarget(targets, alias);
  }
  return targets;
}

/** Reused helper for plugin Config Targets Changed behavior in src/gateway. */
export function pluginConfigTargetsChanged(
  targetIds: Iterable<string>,
  changedPaths: readonly string[],
): boolean {
  const prefixes = Array.from(targetIds, (id) => [
    `plugins.entries.${id}`,
    `plugins.installs.${id}`,
  ]).flat();
  return changedPaths.some((path) =>
    prefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}.`)),
  );
}
