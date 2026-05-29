// cron service contract helpers and runtime behavior.
import type { CronListPageOptions, CronListPageResult } from "./service/list-page-types.js";
import type {
  CronAddInput,
  CronAddResult,
  CronListResult,
  CronRemoveResult,
  CronRunMode,
  CronRunResult,
  CronStatusSummary,
  CronUpdateInput,
  CronUpdateResult,
  CronWakeMode,
} from "./service/state.js";
import type { CronJob } from "./types.js";

type CronWakeResult = { ok: true } | { ok: false; reason?: "unwakeable-session-key" };

/** Shared type for Cron Service Run Result in src/cron. */
export type CronServiceRunResult = CronRunResult | { ok: true; ran: false; reason: "invalid-spec" };

/** Shared type for Cron Service Contract in src/cron. */
export interface CronServiceContract {
  start(): Promise<void>;
  stop(): void;
  status(): Promise<CronStatusSummary>;
  list(opts?: { includeDisabled?: boolean }): Promise<CronListResult>;
  listPage(opts?: CronListPageOptions): Promise<CronListPageResult>;
  add(input: CronAddInput): Promise<CronAddResult>;
  update(id: string, patch: CronUpdateInput): Promise<CronUpdateResult>;
  remove(id: string): Promise<CronRemoveResult>;
  run(id: string, mode?: CronRunMode): Promise<CronServiceRunResult>;
  enqueueRun(id: string, mode?: CronRunMode): Promise<CronServiceRunResult>;
  getJob(id: string): CronJob | undefined;
  readJob(id: string): Promise<CronJob | undefined>;
  getDefaultAgentId(): string | undefined;
  wake(opts: { mode: CronWakeMode; text: string; sessionKey?: string }): CronWakeResult;
}
