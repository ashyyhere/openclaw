// Plugin extension points for memory prompt sections, corpus supplements, and runtime state.
import type { MemoryCitationsMode } from "../config/types.memory.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { MemorySearchManager } from "../memory-host-sdk/host/types.js";

/** Builds memory prompt sections from available tool/citation context. */
export type MemoryPromptSectionBuilder = (params: {
  availableTools: Set<string>;
  citationsMode?: MemoryCitationsMode;
}) => string[];

/** Search result returned by a plugin-provided memory corpus supplement. */
export type MemoryCorpusSearchResult = {
  corpus: string;
  path: string;
  title?: string;
  kind?: string;
  score: number;
  snippet: string;
  id?: string;
  startLine?: number;
  endLine?: number;
  citation?: string;
  source?: string;
  provenanceLabel?: string;
  sourceType?: string;
  sourcePath?: string;
  updatedAt?: string;
};

/** Full document slice returned by a plugin-provided memory corpus supplement. */
export type MemoryCorpusGetResult = {
  corpus: string;
  path: string;
  title?: string;
  kind?: string;
  content: string;
  fromLine: number;
  lineCount: number;
  id?: string;
  provenanceLabel?: string;
  sourceType?: string;
  sourcePath?: string;
  updatedAt?: string;
};

/** Search/get interface exposed by a plugin-provided memory corpus. */
export type MemoryCorpusSupplement = {
  search(params: {
    query: string;
    maxResults?: number;
    agentSessionKey?: string;
  }): Promise<MemoryCorpusSearchResult[]>;
  get(params: {
    lookup: string;
    fromLine?: number;
    lineCount?: number;
    agentSessionKey?: string;
  }): Promise<MemoryCorpusGetResult | null>;
};

/** Registered plugin memory corpus supplement. */
export type MemoryCorpusSupplementRegistration = {
  pluginId: string;
  supplement: MemoryCorpusSupplement;
};

/** Registered plugin memory prompt-section builder. */
export type MemoryPromptSupplementRegistration = {
  pluginId: string;
  builder: MemoryPromptSectionBuilder;
};

/** Plan describing when and how memory should flush transcript context. */
export type MemoryFlushPlan = {
  softThresholdTokens: number;
  forceFlushTranscriptBytes: number;
  reserveTokensFloor: number;
  model?: string;
  prompt: string;
  systemPrompt: string;
  relativePath: string;
};

/** Resolves the current memory flush plan from config and time. */
export type MemoryFlushPlanResolver = (params: {
  cfg?: OpenClawConfig;
  nowMs?: number;
}) => MemoryFlushPlan | null;

/** Registered memory search manager implementation. */
export type RegisteredMemorySearchManager = MemorySearchManager;

/** Runtime command config for QMD-backed memory. */
export type MemoryRuntimeQmdConfig = {
  command?: string;
};

/** Runtime backend config for memory services. */
export type MemoryRuntimeBackendConfig =
  | {
      backend: "builtin";
    }
  | {
      backend: "qmd";
      qmd?: MemoryRuntimeQmdConfig;
    };

/** Runtime hooks supplied by the active memory plugin. */
export type MemoryPluginRuntime = {
  getMemorySearchManager(params: {
    cfg: OpenClawConfig;
    agentId: string;
    purpose?: "default" | "status" | "cli";
  }): Promise<{
    manager: RegisteredMemorySearchManager | null;
    error?: string;
  }>;
  resolveMemoryBackendConfig(params: {
    cfg: OpenClawConfig;
    agentId: string;
  }): MemoryRuntimeBackendConfig;
  closeMemorySearchManager?(params: { cfg: OpenClawConfig; agentId: string }): Promise<void>;
  closeAllMemorySearchManagers?(): Promise<void>;
};

/** Content type labels for memory artifacts exposed by a plugin. */
export type MemoryPluginPublicArtifactContentType = "markdown" | "json" | "text";

/** Public artifact produced by a memory plugin for inspection or export. */
export type MemoryPluginPublicArtifact = {
  kind: string;
  workspaceDir: string;
  relativePath: string;
  absolutePath: string;
  agentIds: string[];
  contentType: MemoryPluginPublicArtifactContentType;
};

/** Provider that lists public artifacts owned by a memory plugin. */
export type MemoryPluginPublicArtifactsProvider = {
  listArtifacts(params: { cfg: OpenClawConfig }): Promise<MemoryPluginPublicArtifact[]>;
};

/** Capability bundle registered by the active memory plugin. */
export type MemoryPluginCapability = {
  promptBuilder?: MemoryPromptSectionBuilder;
  flushPlanResolver?: MemoryFlushPlanResolver;
  runtime?: MemoryPluginRuntime;
  publicArtifacts?: MemoryPluginPublicArtifactsProvider;
};

/** Registered active memory plugin capability and owner id. */
export type MemoryPluginCapabilityRegistration = {
  pluginId: string;
  capability: MemoryPluginCapability;
};

const LEGACY_MEMORY_COMPAT_PLUGIN_ID = "legacy-memory-v1";

type MemoryPluginState = {
  capability?: MemoryPluginCapabilityRegistration;
  corpusSupplements: MemoryCorpusSupplementRegistration[];
  promptSupplements: MemoryPromptSupplementRegistration[];
};

const memoryPluginState: MemoryPluginState = {
  corpusSupplements: [],
  promptSupplements: [],
};

/** Register or replace a corpus supplement for a plugin. */
export function registerMemoryCorpusSupplement(
  pluginId: string,
  supplement: MemoryCorpusSupplement,
): void {
  const next = memoryPluginState.corpusSupplements.filter(
    (registration) => registration.pluginId !== pluginId,
  );
  next.push({ pluginId, supplement });
  memoryPluginState.corpusSupplements = next;
}

/** Register the active memory plugin capability bundle. */
export function registerMemoryCapability(
  pluginId: string,
  capability: MemoryPluginCapability,
): void {
  const existingCapability = memoryPluginState.capability?.capability;
  // A selected memory plugin can add bridge artifacts while memory-core owns sidecar runtime hooks.
  const shouldPreserveExisting =
    existingCapability &&
    Boolean(capability.publicArtifacts) &&
    !capability.promptBuilder &&
    !capability.flushPlanResolver &&
    !capability.runtime;
  memoryPluginState.capability = {
    pluginId,
    capability: {
      ...(shouldPreserveExisting ? existingCapability : {}),
      ...capability,
    },
  };
}

function patchMemoryCapability(pluginId: string, patch: MemoryPluginCapability): void {
  const current =
    memoryPluginState.capability?.pluginId === pluginId
      ? memoryPluginState.capability.capability
      : {};
  registerMemoryCapability(pluginId, { ...current, ...patch });
}

/** Return a copy of the active memory capability registration. */
export function getMemoryCapabilityRegistration(): MemoryPluginCapabilityRegistration | undefined {
  return memoryPluginState.capability
    ? {
        pluginId: memoryPluginState.capability.pluginId,
        capability: { ...memoryPluginState.capability.capability },
      }
    : undefined;
}

/** List registered memory corpus supplements. */
export function listMemoryCorpusSupplements(): MemoryCorpusSupplementRegistration[] {
  return [...memoryPluginState.corpusSupplements];
}

/** @deprecated Use registerMemoryCapability(pluginId, { promptBuilder }) instead. */
export function registerMemoryPromptSection(builder: MemoryPromptSectionBuilder): void {
  registerMemoryPromptSectionForPlugin(LEGACY_MEMORY_COMPAT_PLUGIN_ID, builder);
}

/** Register the primary memory prompt section builder for a plugin. */
export function registerMemoryPromptSectionForPlugin(
  pluginId: string,
  builder: MemoryPromptSectionBuilder,
): void {
  patchMemoryCapability(pluginId, { promptBuilder: builder });
}

/** Register an additional memory prompt supplement builder for a plugin. */
export function registerMemoryPromptSupplement(
  pluginId: string,
  builder: MemoryPromptSectionBuilder,
): void {
  const next = memoryPluginState.promptSupplements.filter(
    (registration) => registration.pluginId !== pluginId,
  );
  next.push({ pluginId, builder });
  memoryPluginState.promptSupplements = next;
}

/** Build the combined memory prompt section from primary and supplemental builders. */
export function buildMemoryPromptSection(params: {
  availableTools: Set<string>;
  citationsMode?: MemoryCitationsMode;
}): string[] {
  const primary = normalizeMemoryPromptLines(
    memoryPluginState.capability?.capability.promptBuilder?.(params) ?? [],
  );
  const supplements = memoryPluginState.promptSupplements
    // Keep supplement order stable even if plugin registration order changes.
    .toSorted((left, right) => left.pluginId.localeCompare(right.pluginId))
    .flatMap((registration) => normalizeMemoryPromptLines(registration.builder(params)));
  return [...primary, ...supplements];
}

function normalizeMemoryPromptLines(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((line): line is string => typeof line === "string");
}

/** Return the active primary memory prompt section builder. */
export function getMemoryPromptSectionBuilder(): MemoryPromptSectionBuilder | undefined {
  return memoryPluginState.capability?.capability.promptBuilder;
}

/** List registered memory prompt supplements. */
export function listMemoryPromptSupplements(): MemoryPromptSupplementRegistration[] {
  return [...memoryPluginState.promptSupplements];
}

/** @deprecated Use registerMemoryCapability(pluginId, { flushPlanResolver }) instead. */
export function registerMemoryFlushPlanResolver(resolver: MemoryFlushPlanResolver): void {
  registerMemoryFlushPlanResolverForPlugin(LEGACY_MEMORY_COMPAT_PLUGIN_ID, resolver);
}

/** Register the memory flush-plan resolver for a plugin. */
export function registerMemoryFlushPlanResolverForPlugin(
  pluginId: string,
  resolver: MemoryFlushPlanResolver,
): void {
  patchMemoryCapability(pluginId, { flushPlanResolver: resolver });
}

/** Resolve the current memory flush plan from the active memory capability. */
export function resolveMemoryFlushPlan(params: {
  cfg?: OpenClawConfig;
  nowMs?: number;
}): MemoryFlushPlan | null {
  return memoryPluginState.capability?.capability.flushPlanResolver?.(params) ?? null;
}

/** Return the active memory flush-plan resolver. */
export function getMemoryFlushPlanResolver(): MemoryFlushPlanResolver | undefined {
  return memoryPluginState.capability?.capability.flushPlanResolver;
}

/** @deprecated Use registerMemoryCapability(pluginId, { runtime }) instead. */
export function registerMemoryRuntime(runtime: MemoryPluginRuntime): void {
  registerMemoryRuntimeForPlugin(LEGACY_MEMORY_COMPAT_PLUGIN_ID, runtime);
}

/** Register memory runtime hooks for a plugin. */
export function registerMemoryRuntimeForPlugin(
  pluginId: string,
  runtime: MemoryPluginRuntime,
): void {
  patchMemoryCapability(pluginId, { runtime });
}

/** Return the active memory runtime hooks. */
export function getMemoryRuntime(): MemoryPluginRuntime | undefined {
  return memoryPluginState.capability?.capability.runtime;
}

/** Return whether a memory runtime has been registered. */
export function hasMemoryRuntime(): boolean {
  return getMemoryRuntime() !== undefined;
}

function cloneMemoryPublicArtifact(
  artifact: MemoryPluginPublicArtifact,
): MemoryPluginPublicArtifact {
  return {
    ...artifact,
    agentIds: [...artifact.agentIds],
  };
}

/** List public memory artifacts from the active memory plugin in stable order. */
export async function listActiveMemoryPublicArtifacts(params: {
  cfg: OpenClawConfig;
}): Promise<MemoryPluginPublicArtifact[]> {
  const artifacts =
    (await memoryPluginState.capability?.capability.publicArtifacts?.listArtifacts(params)) ?? [];
  return artifacts.map(cloneMemoryPublicArtifact).toSorted((left, right) => {
    const workspaceOrder = left.workspaceDir.localeCompare(right.workspaceDir);
    if (workspaceOrder !== 0) {
      return workspaceOrder;
    }
    const relativePathOrder = left.relativePath.localeCompare(right.relativePath);
    if (relativePathOrder !== 0) {
      return relativePathOrder;
    }
    const kindOrder = left.kind.localeCompare(right.kind);
    if (kindOrder !== 0) {
      return kindOrder;
    }
    const contentTypeOrder = left.contentType.localeCompare(right.contentType);
    if (contentTypeOrder !== 0) {
      return contentTypeOrder;
    }
    const agentOrder = left.agentIds.join("\0").localeCompare(right.agentIds.join("\0"));
    if (agentOrder !== 0) {
      return agentOrder;
    }
    return left.absolutePath.localeCompare(right.absolutePath);
  });
}

/** Restore memory plugin registrations from a captured state object. */
export function restoreMemoryPluginState(state: MemoryPluginState): void {
  memoryPluginState.capability = state.capability
    ? {
        pluginId: state.capability.pluginId,
        capability: { ...state.capability.capability },
      }
    : undefined;
  memoryPluginState.corpusSupplements = [...state.corpusSupplements];
  memoryPluginState.promptSupplements = [...state.promptSupplements];
}

/** Clear all memory plugin capability and supplement registrations. */
export function clearMemoryPluginState(): void {
  memoryPluginState.capability = undefined;
  memoryPluginState.corpusSupplements = [];
  memoryPluginState.promptSupplements = [];
}

/** Alias for clearing all memory plugin state. */
export const resetMemoryPluginState = clearMemoryPluginState;
