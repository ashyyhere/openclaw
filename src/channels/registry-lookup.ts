/** Low-level lookup helpers for active plugin channel registry snapshots. */
import type {
  ActivePluginChannelRegistration,
  ActivePluginChannelRegistry,
} from "../plugins/channel-registry-state.types.js";
import { getActivePluginChannelRegistrySnapshotFromState } from "../plugins/runtime-channel-state.js";
import { normalizeOptionalLowercaseString } from "../shared/string-coerce.js";

/** Shared type for Registered Channel Plugin Entry in src/channels. */
export type RegisteredChannelPluginEntry = ActivePluginChannelRegistration & {
  plugin: ActivePluginChannelRegistration["plugin"] & {
    id?: string | null;
    meta?: {
      aliases?: readonly string[];
      markdownCapable?: boolean;
    } | null;
  };
};

type RegisteredChannelPluginLookup = {
  registry: ActivePluginChannelRegistry | null;
  channels: ActivePluginChannelRegistration[] | undefined;
  channelCount: number;
  version: number;
  entries: RegisteredChannelPluginEntry[];
  byKey: Map<string, RegisteredChannelPluginEntry>;
  byId: Map<string, RegisteredChannelPluginEntry>;
};

let registeredChannelPluginLookup: RegisteredChannelPluginLookup | undefined;

function setLookupEntry(
  map: Map<string, RegisteredChannelPluginEntry>,
  key: string | undefined,
  entry: RegisteredChannelPluginEntry,
): void {
  if (key && !map.has(key)) {
    map.set(key, entry);
  }
}

function buildRegisteredChannelPluginLookup(): RegisteredChannelPluginLookup {
  const { registry, version } = getActivePluginChannelRegistrySnapshotFromState();
  const channels = Array.isArray(registry?.channels) ? registry.channels : undefined;
  const channelCount = channels?.length ?? 0;
  const cached = registeredChannelPluginLookup;
  if (
    cached &&
    cached.registry === registry &&
    cached.channels === channels &&
    cached.channelCount === channelCount &&
    cached.version === version
  ) {
    return cached;
  }
  const entries = channelCount > 0 ? (channels as RegisteredChannelPluginEntry[]) : [];
  const byKey = new Map<string, RegisteredChannelPluginEntry>();
  const byId = new Map<string, RegisteredChannelPluginEntry>();
  for (const entry of entries) {
    const id = normalizeOptionalLowercaseString(entry.plugin.id ?? "");
    setLookupEntry(byKey, id, entry);
    setLookupEntry(byId, id, entry);
    for (const alias of entry.plugin.meta?.aliases ?? []) {
      setLookupEntry(byKey, normalizeOptionalLowercaseString(alias), entry);
    }
  }
  registeredChannelPluginLookup = {
    registry,
    channels,
    channelCount,
    version,
    entries,
    byKey,
    byId,
  };
  return registeredChannelPluginLookup;
}

/** Reused helper for list Registered Channel Plugin Entries behavior in src/channels. */
export function listRegisteredChannelPluginEntries(): RegisteredChannelPluginEntry[] {
  return buildRegisteredChannelPluginLookup().entries;
}

/** Reused helper for find Registered Channel Plugin Entry behavior in src/channels. */
export function findRegisteredChannelPluginEntry(
  normalizedKey: string,
): RegisteredChannelPluginEntry | undefined {
  return buildRegisteredChannelPluginLookup().byKey.get(normalizedKey);
}

/** Reused helper for find Registered Channel Plugin Entry By Id behavior in src/channels. */
export function findRegisteredChannelPluginEntryById(
  id: string,
): RegisteredChannelPluginEntry | undefined {
  const normalizedId = normalizeOptionalLowercaseString(id);
  if (!normalizedId) {
    return undefined;
  }
  return buildRegisteredChannelPluginLookup().byId.get(normalizedId);
}
