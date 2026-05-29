// plugins memory state helpers and runtime behavior.
import type { MemoryCitationsMode } from "../config/types.memory.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { MemorySearchManager } from "../memory-host-sdk/host/types.js";

/** Shared type for Memory Prompt Section Builder in src/plugins. */
export type MemoryPromptSectionBuilder = (params: {
  availableTools: Set<string>;
  citationsMode?: MemoryCitationsMode;
}) => string[];

/** Shared type for Memory Corpus Search Result in src/plugins. */
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

/** Shared type for Memory Corpus Get Result in src/plugins. */
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

/** Shared type for Memory Corpus Supplement in src/plugins. */
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

/** Shared type for Memory Corpus Supplement Registration in src/plugins. */
export type MemoryCorpusSupplementRegistration = {
  pluginId: string;
  supplement: MemoryCorpusSupplement;
};

/** Shared type for Memory Prompt Supplement Registration in src/plugins. */
export type MemoryPromptSupplementRegistration = {
  pluginId: string;
  builder: MemoryPromptSectionBuilder;
};

/** Shared type for Memory Flush Plan in src/plugins. */
export type MemoryFlushPlan = {
  softThresholdTokens: number;
  forceFlushTranscriptBytes: number;
  reserveTokensFloor: number;
  model?: string;
  prompt: string;
  systemPrompt: string;
  relativePath: string;
};

/** Shared type for Memory Flush Plan Resolver in src/plugins. */
export type MemoryFlushPlanResolver = (params: {
  cfg?: OpenClawConfig;
  nowMs?: number;
}) => MemoryFlushPlan | null;

/** Shared type for Registered Memory Search Manager in src/plugins. */
export type RegisteredMemorySearchManager = MemorySearchManager;

/** Shared type for Memory Runtime Qmd Config in src/plugins. */
export type MemoryRuntimeQmdConfig = {
  command?: string;
};

/** Shared type for Memory Runtime Backend Config in src/plugins. */
export type MemoryRuntimeBackendConfig =
  | {
      backend: "builtin";
    }
  | {
      backend: "qmd";
      qmd?: MemoryRuntimeQmdConfig;
    };

/** Shared type for Memory Plugin Runtime in src/plugins. */
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

/** Shared type for Memory Plugin Public Artifact Content Type in src/plugins. */
export type MemoryPluginPublicArtifactContentType = "markdown" | "json" | "text";

/** Shared type for Memory Plugin Public Artifact in src/plugins. */
export type MemoryPluginPublicArtifact = {
  kind: string;
  workspaceDir: string;
  relativePath: string;
  absolutePath: string;
  agentIds: string[];
  contentType: MemoryPluginPublicArtifactContentType;
};

/** Shared type for Memory Plugin Public Artifacts Provider in src/plugins. */
export type MemoryPluginPublicArtifactsProvider = {
  listArtifacts(params: { cfg: OpenClawConfig }): Promise<MemoryPluginPublicArtifact[]>;
};

/** Shared type for Memory Plugin Capability in src/plugins. */
export type MemoryPluginCapability = {
  promptBuilder?: MemoryPromptSectionBuilder;
  flushPlanResolver?: MemoryFlushPlanResolver;
  runtime?: MemoryPluginRuntime;
  publicArtifacts?: MemoryPluginPublicArtifactsProvider;
};

/** Shared type for Memory Plugin Capability Registration in src/plugins. */
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

/** Reused helper for register Memory Corpus Supplement behavior in src/plugins. */
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

/** Reused helper for register Memory Capability behavior in src/plugins. */
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

/** Reused helper for get Memory Capability Registration behavior in src/plugins. */
export function getMemoryCapabilityRegistration(): MemoryPluginCapabilityRegistration | undefined {
  return memoryPluginState.capability
    ? {
        pluginId: memoryPluginState.capability.pluginId,
        capability: { ...memoryPluginState.capability.capability },
      }
    : undefined;
}

/** Reused helper for list Memory Corpus Supplements behavior in src/plugins. */
export function listMemoryCorpusSupplements(): MemoryCorpusSupplementRegistration[] {
  return [...memoryPluginState.corpusSupplements];
}

/** @deprecated Use registerMemoryCapability(pluginId, { promptBuilder }) instead. */
export function registerMemoryPromptSection(builder: MemoryPromptSectionBuilder): void {
  registerMemoryPromptSectionForPlugin(LEGACY_MEMORY_COMPAT_PLUGIN_ID, builder);
}

/** Reused helper for register Memory Prompt Section For Plugin behavior in src/plugins. */
export function registerMemoryPromptSectionForPlugin(
  pluginId: string,
  builder: MemoryPromptSectionBuilder,
): void {
  patchMemoryCapability(pluginId, { promptBuilder: builder });
}

/** Reused helper for register Memory Prompt Supplement behavior in src/plugins. */
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

/** Reused helper for build Memory Prompt Section behavior in src/plugins. */
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

/** Reused helper for get Memory Prompt Section Builder behavior in src/plugins. */
export function getMemoryPromptSectionBuilder(): MemoryPromptSectionBuilder | undefined {
  return memoryPluginState.capability?.capability.promptBuilder;
}

/** Reused helper for list Memory Prompt Supplements behavior in src/plugins. */
export function listMemoryPromptSupplements(): MemoryPromptSupplementRegistration[] {
  return [...memoryPluginState.promptSupplements];
}

/** @deprecated Use registerMemoryCapability(pluginId, { flushPlanResolver }) instead. */
export function registerMemoryFlushPlanResolver(resolver: MemoryFlushPlanResolver): void {
  registerMemoryFlushPlanResolverForPlugin(LEGACY_MEMORY_COMPAT_PLUGIN_ID, resolver);
}

/** Reused helper for register Memory Flush Plan Resolver For Plugin behavior in src/plugins. */
export function registerMemoryFlushPlanResolverForPlugin(
  pluginId: string,
  resolver: MemoryFlushPlanResolver,
): void {
  patchMemoryCapability(pluginId, { flushPlanResolver: resolver });
}

/** Reused helper for resolve Memory Flush Plan behavior in src/plugins. */
export function resolveMemoryFlushPlan(params: {
  cfg?: OpenClawConfig;
  nowMs?: number;
}): MemoryFlushPlan | null {
  return memoryPluginState.capability?.capability.flushPlanResolver?.(params) ?? null;
}

/** Reused helper for get Memory Flush Plan Resolver behavior in src/plugins. */
export function getMemoryFlushPlanResolver(): MemoryFlushPlanResolver | undefined {
  return memoryPluginState.capability?.capability.flushPlanResolver;
}

/** @deprecated Use registerMemoryCapability(pluginId, { runtime }) instead. */
export function registerMemoryRuntime(runtime: MemoryPluginRuntime): void {
  registerMemoryRuntimeForPlugin(LEGACY_MEMORY_COMPAT_PLUGIN_ID, runtime);
}

/** Reused helper for register Memory Runtime For Plugin behavior in src/plugins. */
export function registerMemoryRuntimeForPlugin(
  pluginId: string,
  runtime: MemoryPluginRuntime,
): void {
  patchMemoryCapability(pluginId, { runtime });
}

/** Reused helper for get Memory Runtime behavior in src/plugins. */
export function getMemoryRuntime(): MemoryPluginRuntime | undefined {
  return memoryPluginState.capability?.capability.runtime;
}

/** Reused helper for has Memory Runtime behavior in src/plugins. */
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

/** Reused helper for list Active Memory Public Artifacts behavior in src/plugins. */
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

/** Reused helper for restore Memory Plugin State behavior in src/plugins. */
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

/** Reused helper for clear Memory Plugin State behavior in src/plugins. */
export function clearMemoryPluginState(): void {
  memoryPluginState.capability = undefined;
  memoryPluginState.corpusSupplements = [];
  memoryPluginState.promptSupplements = [];
}

/** Reused constant for reset Memory Plugin State behavior in src/plugins. */
export const resetMemoryPluginState = clearMemoryPluginState;
