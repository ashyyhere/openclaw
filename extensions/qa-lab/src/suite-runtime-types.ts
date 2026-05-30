// QA Lab suite-runtime types describe gateway, transport, config, and session state.
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import type { QaProviderMode } from "./model-selection.js";
import type { QaTransportActionName, QaTransportAdapter } from "./qa-transport.js";

type QaRuntimeGatewayClient = {
  baseUrl: string;
  tempRoot: string;
  workspaceDir: string;
  runtimeEnv: NodeJS.ProcessEnv;
  getProcessCpuMs?: () => number | null;
  getProcessRssBytes?: () => number | null;
  logs?: () => string;
  restartAfterStateMutation?: (
    mutateState: (context: {
      configPath: string;
      runtimeEnv: NodeJS.ProcessEnv;
      stateDir: string;
      tempRoot: string;
    }) => Promise<void>,
  ) => Promise<void>;
  call: (
    method: string,
    params?: unknown,
    options?: {
      timeoutMs?: number;
    },
  ) => Promise<unknown>;
};

type QaRuntimeTransport = QaTransportAdapter;

/** Runtime environment passed to QA Lab scenario handlers. */
export type QaSuiteRuntimeEnv = {
  gateway: QaRuntimeGatewayClient;
  transport: QaRuntimeTransport;
  repoRoot: string;
  providerMode: QaProviderMode;
  primaryModel: string;
  alternateModel: string;
  mock: {
    baseUrl: string;
  } | null;
  cfg: OpenClawConfig;
};

/** Skill status row returned by the gateway skill-status call. */
export type QaSkillStatusEntry = {
  name?: string;
  eligible?: boolean;
  disabled?: boolean;
  blockedByAllowlist?: boolean;
};

/** Snapshot of gateway config used by stateful QA checks. */
export type QaConfigSnapshot = {
  hash?: string;
  config?: Record<string, unknown>;
};

/** Memory dreaming status summary read from runtime diagnostics. */
export type QaDreamingStatus = {
  enabled?: boolean;
  shortTermCount?: number;
  promotedTotal?: number;
  phaseSignalCount?: number;
  lightPhaseHitCount?: number;
  remPhaseHitCount?: number;
  phases?: {
    deep?: {
      managedCronPresent?: boolean;
      nextRunAtMs?: number;
    };
  };
};

/** Raw session-store entry read from the QA agent state directory. */
export type QaRawSessionStoreEntry = {
  sessionId?: string;
  sessionFile?: string;
  status?: string;
  spawnedBy?: string;
  label?: string;
  abortedLastRun?: boolean;
  updatedAt?: number;
};

/** Minimal runtime environment needed by transport action handlers. */
export type QaRuntimeActionHandlerEnv = Pick<QaSuiteRuntimeEnv, "cfg" | "transport">;
/** QA transport action names accepted by runtime action handlers. */
export type { QaTransportActionName };
