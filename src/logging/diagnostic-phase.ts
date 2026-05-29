// Diagnostic phase timing helpers with recent in-memory snapshots and optional event emission.
import { performance } from "node:perf_hooks";
import {
  areDiagnosticsEnabledForProcess,
  emitDiagnosticEvent,
  type DiagnosticPhaseDetails,
  type DiagnosticPhaseSnapshot,
} from "../infra/diagnostic-events.js";

const RECENT_PHASE_CAPACITY = 40;

type ActiveDiagnosticPhase = {
  name: string;
  startedAt: number;
  startedWallMs: number;
  cpuStarted: NodeJS.CpuUsage;
  details?: DiagnosticPhaseDetails;
};

let activePhaseStack: ActiveDiagnosticPhase[] = [];
let recentPhases: DiagnosticPhaseSnapshot[] = [];

function roundMetric(value: number, digits = 1): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function pushRecentPhase(snapshot: DiagnosticPhaseSnapshot): void {
  recentPhases.push(snapshot);
  if (recentPhases.length > RECENT_PHASE_CAPACITY) {
    recentPhases = recentPhases.slice(-RECENT_PHASE_CAPACITY);
  }
}

/** Returns the currently active diagnostic phase name, if any. */
export function getCurrentDiagnosticPhase(): string | undefined {
  return activePhaseStack.at(-1)?.name;
}

function resolveRecentPhaseLimit(limit: number): number | null {
  if (!Number.isFinite(limit) || limit <= 0) {
    return null;
  }
  return Math.floor(limit);
}

/** Returns recent completed diagnostic phases, newest-limited by count. */
export function getRecentDiagnosticPhases(limit = 8): DiagnosticPhaseSnapshot[] {
  const resolved = resolveRecentPhaseLimit(limit);
  if (resolved === null) {
    return [];
  }
  return recentPhases.slice(-resolved).map((phase) => Object.assign({}, phase));
}

/** Records a completed phase and emits a diagnostic event when diagnostics are enabled. */
export function recordDiagnosticPhase(snapshot: DiagnosticPhaseSnapshot): void {
  pushRecentPhase(snapshot);
  if (!areDiagnosticsEnabledForProcess()) {
    return;
  }
  emitDiagnosticEvent({
    type: "diagnostic.phase.completed",
    ...snapshot,
  });
}

/** Runs work inside a timed diagnostic phase and records wall/cpu metrics on completion. */
export async function withDiagnosticPhase<T>(
  name: string,
  run: () => Promise<T> | T,
  details?: DiagnosticPhaseDetails,
): Promise<T> {
  const active: ActiveDiagnosticPhase = {
    name,
    startedAt: Date.now(),
    startedWallMs: performance.now(),
    cpuStarted: process.cpuUsage(),
    details,
  };
  activePhaseStack.push(active);
  try {
    return await run();
  } finally {
    const endedAt = Date.now();
    const durationMs = roundMetric(performance.now() - active.startedWallMs, 1);
    const cpu = process.cpuUsage(active.cpuStarted);
    const cpuUserMs = roundMetric(cpu.user / 1_000, 1);
    const cpuSystemMs = roundMetric(cpu.system / 1_000, 1);
    const cpuTotalMs = roundMetric(cpuUserMs + cpuSystemMs, 1);
    activePhaseStack = activePhaseStack.filter((entry) => entry !== active);
    recordDiagnosticPhase({
      name,
      startedAt: active.startedAt,
      endedAt,
      durationMs,
      cpuUserMs,
      cpuSystemMs,
      cpuTotalMs,
      cpuCoreRatio: roundMetric(cpuTotalMs / Math.max(1, durationMs), 3),
      details: active.details,
    });
  }
}

/** Clears active/recent diagnostic phase state for tests. */
export function resetDiagnosticPhasesForTest(): void {
  activePhaseStack = [];
  recentPhases = [];
}
