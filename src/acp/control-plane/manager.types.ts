/** Shared ACP control-plane types for sessions, turns, lifecycle, and observability. */
import type {
  SessionAcpIdentity,
  AcpSessionRuntimeOptions,
  SessionAcpMeta,
  SessionEntry,
} from "../../config/sessions/types.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AcpRuntimeError } from "../runtime/errors.js";
import { getAcpRuntimeBackend, requireAcpRuntimeBackend } from "../runtime/registry.js";
import {
  listAcpSessionEntries,
  readAcpSessionEntry,
  upsertAcpSessionMeta,
} from "../runtime/session-meta.js";
import type {
  AcpRuntime,
  AcpRuntimeCapabilities,
  AcpRuntimeEvent,
  AcpRuntimeHandle,
  AcpRuntimePromptMode,
  AcpRuntimeSessionMode,
  AcpRuntimeStatus,
} from "../runtime/types.js";

/** Result of resolving persisted ACP session metadata for a session key. */
export type AcpSessionResolution =
  | {
      kind: "none";
      sessionKey: string;
    }
  | {
      kind: "stale";
      sessionKey: string;
      error: AcpRuntimeError;
    }
  | {
      kind: "ready";
      sessionKey: string;
      meta: SessionAcpMeta;
    };

/** Inputs needed to create or resume an ACP session through the control plane. */
export type AcpInitializeSessionInput = {
  cfg: OpenClawConfig;
  sessionKey: string;
  agent: string;
  mode: AcpRuntimeSessionMode;
  resumeSessionId?: string;
  runtimeOptions?: Partial<AcpSessionRuntimeOptions>;
  cwd?: string;
  backendId?: string;
};

/** Inline attachment passed from a control-plane turn to the runtime adapter. */
export type AcpTurnAttachment = {
  mediaType: string;
  data: string;
};

/** Inputs for submitting a prompt or steering turn through an ACP session. */
export type AcpRunTurnInput = {
  cfg: OpenClawConfig;
  sessionKey: string;
  text: string;
  attachments?: AcpTurnAttachment[];
  mode: AcpRuntimePromptMode;
  requestId: string;
  signal?: AbortSignal;
  onLifecycle?: (event: AcpTurnLifecycleEvent) => Promise<void> | void;
  onEvent?: (event: AcpRuntimeEvent) => Promise<void> | void;
};

/** Control-plane lifecycle notification emitted around turn submission. */
export type AcpTurnLifecycleEvent = {
  type: "prompt_submitted";
  at: number;
};

/** Inputs for closing runtime state and optionally clearing ACP session metadata. */
export type AcpCloseSessionInput = {
  cfg: OpenClawConfig;
  sessionKey: string;
  reason: string;
  discardPersistentState?: boolean;
  clearMeta?: boolean;
  allowBackendUnavailable?: boolean;
  requireAcpSession?: boolean;
};

/** Result of closing an ACP runtime session and its persisted metadata. */
export type AcpCloseSessionResult = {
  runtimeClosed: boolean;
  runtimeNotice?: string;
  metaCleared: boolean;
};

/** Control-plane status view combining persisted ACP metadata and runtime status. */
export type AcpSessionStatus = {
  sessionKey: string;
  backend: string;
  agent: string;
  identity?: SessionAcpIdentity;
  state: SessionAcpMeta["state"];
  mode: AcpRuntimeSessionMode;
  runtimeOptions: AcpSessionRuntimeOptions;
  capabilities: AcpRuntimeCapabilities;
  runtimeStatus?: AcpRuntimeStatus;
  lastActivityAt: number;
  lastError?: string;
};

/** Point-in-time ACP manager counters for runtime cache, turn queue, and errors. */
export type AcpManagerObservabilitySnapshot = {
  runtimeCache: {
    activeSessions: number;
    idleTtlMs: number;
    evictedTotal: number;
    lastEvictedAt?: number;
  };
  turns: {
    active: number;
    queueDepth: number;
    completed: number;
    failed: number;
    averageLatencyMs: number;
    maxLatencyMs: number;
  };
  errorsByCode: Record<string, number>;
};

/** Counts from startup reconciliation of ACP identities stored in session metadata. */
export type AcpStartupIdentityReconcileResult = {
  checked: number;
  resolved: number;
  failed: number;
};

/** In-flight turn state held while the manager streams runtime events. */
export type ActiveTurnState = {
  runtime: AcpRuntime;
  handle: AcpRuntimeHandle;
  abortController: AbortController;
  cancelPromise?: Promise<void>;
};

/** Accumulator for completed and failed ACP turn latency metrics. */
export type TurnLatencyStats = {
  completed: number;
  failed: number;
  totalMs: number;
  maxMs: number;
};

/** Injectable ACP manager dependencies used by production code and tests. */
export type AcpSessionManagerDeps = {
  listAcpSessions: typeof listAcpSessionEntries;
  readSessionEntry: typeof readAcpSessionEntry;
  upsertSessionMeta: typeof upsertAcpSessionMeta;
  getRuntimeBackend: typeof getAcpRuntimeBackend;
  requireRuntimeBackend: typeof requireAcpRuntimeBackend;
};

/** Production ACP manager dependency set backed by session metadata and runtime registries. */
export const DEFAULT_DEPS: AcpSessionManagerDeps = {
  listAcpSessions: listAcpSessionEntries,
  readSessionEntry: readAcpSessionEntry,
  upsertSessionMeta: upsertAcpSessionMeta,
  getRuntimeBackend: getAcpRuntimeBackend,
  requireRuntimeBackend: requireAcpRuntimeBackend,
};

/** Session metadata types re-exported for ACP control-plane callers. */
export type { AcpSessionRuntimeOptions, SessionAcpMeta, SessionEntry };
