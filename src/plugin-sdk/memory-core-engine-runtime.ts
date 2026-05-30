/**
 * @deprecated Public SDK subpath has no bundled extension production imports.
 * Prefer vendor-neutral memory-host SDK subpaths for new plugin code.
 */
import type { OpenClawConfig } from "../config/types.js";
import {
  createLazyFacadeObjectValue,
  loadActivatedBundledPluginPublicSurfaceModuleSync,
} from "./facade-runtime.js";
import type { MemorySearchManager } from "./memory-core-host-engine-storage.js";

/** Doctor metadata for bundled memory embedding providers. */
export type BuiltinMemoryEmbeddingProviderDoctorMetadata = {
  providerId: string;
  authProviderId: string;
  envVars: string[];
  transport: "local" | "remote";
  autoSelectPriority?: number;
};

/** Single issue found while auditing long-term dreaming artifacts. */
export type DreamingArtifactsAuditIssue = {
  severity: "warn" | "error";
  code:
    | "dreaming-session-corpus-unreadable"
    | "dreaming-session-corpus-self-ingested"
    | "dreaming-session-ingestion-unreadable"
    | "dreaming-diary-unreadable";
  message: string;
  fixable: boolean;
};

/** Audit summary for long-term dreaming corpus and ingestion artifacts. */
export type DreamingArtifactsAuditSummary = {
  dreamsPath?: string;
  sessionCorpusDir: string;
  sessionCorpusFileCount: number;
  suspiciousSessionCorpusFileCount: number;
  suspiciousSessionCorpusLineCount: number;
  sessionIngestionPath: string;
  sessionIngestionExists: boolean;
  issues: DreamingArtifactsAuditIssue[];
};

/** Result of archiving or repairing dreaming-related memory artifacts. */
export type RepairDreamingArtifactsResult = {
  changed: boolean;
  archiveDir?: string;
  archivedDreamsDiary: boolean;
  archivedSessionCorpus: boolean;
  archivedSessionIngestion: boolean;
  archivedPaths: string[];
  warnings: string[];
};

/** Single issue found while auditing short-term promotion artifacts. */
export type ShortTermAuditIssue = {
  severity: "warn" | "error";
  code:
    | "recall-store-unreadable"
    | "recall-store-empty"
    | "recall-store-invalid"
    | "recall-store-over-limit"
    | "recall-lock-stale"
    | "recall-lock-unreadable"
    | "qmd-index-missing"
    | "qmd-index-empty"
    | "qmd-collections-empty";
  message: string;
  fixable: boolean;
};

/** Audit summary for short-term recall store, lock, and Qdrant metadata. */
export type ShortTermAuditSummary = {
  storePath: string;
  lockPath: string;
  updatedAt?: string;
  exists: boolean;
  entryCount: number;
  promotedCount: number;
  spacedEntryCount: number;
  conceptTaggedEntryCount: number;
  conceptTagScripts?: Record<string, unknown>;
  invalidEntryCount: number;
  issues: ShortTermAuditIssue[];
  qmd?:
    | {
        dbPath?: string;
        collections?: number;
        dbBytes?: number;
      }
    | undefined;
};

/** Result of repairing short-term promotion recall artifacts. */
export type RepairShortTermPromotionArtifactsResult = {
  changed: boolean;
  removedInvalidEntries: number;
  removedOverflowEntries?: number;
  rewroteStore: boolean;
  removedStaleLock: boolean;
};

type MemoryIndexManagerFacade = {
  get(params: {
    cfg: OpenClawConfig;
    agentId: string;
    purpose?: "default" | "status";
  }): Promise<MemorySearchManager | null>;
};

type FacadeModule = {
  auditShortTermPromotionArtifacts: (params: {
    workspaceDir: string;
    qmd?: {
      dbPath?: string;
      collections?: number;
    };
  }) => Promise<ShortTermAuditSummary>;
  auditDreamingArtifacts: (params: {
    workspaceDir: string;
  }) => Promise<DreamingArtifactsAuditSummary>;
  getBuiltinMemoryEmbeddingProviderDoctorMetadata: (
    providerId: string,
  ) => BuiltinMemoryEmbeddingProviderDoctorMetadata | null;
  getMemorySearchManager: (params: {
    cfg: OpenClawConfig;
    agentId: string;
    purpose?: "default" | "status";
  }) => Promise<{
    manager: MemorySearchManager | null;
    error?: string;
  }>;
  listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata: () => Array<BuiltinMemoryEmbeddingProviderDoctorMetadata>;
  MemoryIndexManager: MemoryIndexManagerFacade;
  repairShortTermPromotionArtifacts: (params: {
    workspaceDir: string;
  }) => Promise<RepairShortTermPromotionArtifactsResult>;
  repairDreamingArtifacts: (params: {
    workspaceDir: string;
    archiveDiary?: boolean;
    now?: Date;
  }) => Promise<RepairDreamingArtifactsResult>;
};

function loadFacadeModule(): FacadeModule {
  return loadActivatedBundledPluginPublicSurfaceModuleSync<FacadeModule>({
    dirName: "memory-core",
    artifactBasename: "runtime-api.js",
  });
}
/** Lazily audits short-term promotion artifacts through the memory-core runtime facade. */
export const auditShortTermPromotionArtifacts: FacadeModule["auditShortTermPromotionArtifacts"] = ((
  ...args
) =>
  loadFacadeModule()["auditShortTermPromotionArtifacts"](
    ...args,
  )) as FacadeModule["auditShortTermPromotionArtifacts"];
/** Lazily audits dreaming artifacts through the memory-core runtime facade. */
export const auditDreamingArtifacts: FacadeModule["auditDreamingArtifacts"] = ((...args) =>
  loadFacadeModule()["auditDreamingArtifacts"](...args)) as FacadeModule["auditDreamingArtifacts"];
/** Lazily reads doctor metadata for a bundled memory embedding provider. */
export const getBuiltinMemoryEmbeddingProviderDoctorMetadata: FacadeModule["getBuiltinMemoryEmbeddingProviderDoctorMetadata"] =
  ((...args) =>
    loadFacadeModule()["getBuiltinMemoryEmbeddingProviderDoctorMetadata"](
      ...args,
    )) as FacadeModule["getBuiltinMemoryEmbeddingProviderDoctorMetadata"];
/** Lazily resolves the memory search manager for an agent. */
export const getMemorySearchManager: FacadeModule["getMemorySearchManager"] = ((...args) =>
  loadFacadeModule()["getMemorySearchManager"](...args)) as FacadeModule["getMemorySearchManager"];
/** Lazily lists bundled memory providers eligible for auto-selection. */
export const listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata: FacadeModule["listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata"] =
  ((...args) =>
    loadFacadeModule()["listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata"](
      ...args,
    )) as FacadeModule["listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata"];
/** Lazy object facade for the memory index manager API. */
export const MemoryIndexManager: FacadeModule["MemoryIndexManager"] = createLazyFacadeObjectValue(
  () => loadFacadeModule()["MemoryIndexManager"] as object,
) as FacadeModule["MemoryIndexManager"];
/** Lazily repairs short-term promotion artifacts through memory-core. */
export const repairShortTermPromotionArtifacts: FacadeModule["repairShortTermPromotionArtifacts"] =
  ((...args) =>
    loadFacadeModule()["repairShortTermPromotionArtifacts"](
      ...args,
    )) as FacadeModule["repairShortTermPromotionArtifacts"];
/** Lazily repairs dreaming artifacts through memory-core. */
export const repairDreamingArtifacts: FacadeModule["repairDreamingArtifacts"] = ((...args) =>
  loadFacadeModule()["repairDreamingArtifacts"](
    ...args,
  )) as FacadeModule["repairDreamingArtifacts"];
