// Shared trajectory event and export manifest schema types.
/** Origin category for a trajectory event row. */
export type TrajectoryEventSource = "runtime" | "transcript" | "export";

/** Tool schema captured with a compiled context trajectory event. */
export type TrajectoryToolDefinition = {
  name: string;
  description?: string;
  parameters?: unknown;
};

/** JSONL event schema used for runtime and transcript trajectory capture. */
export type TrajectoryEvent = {
  traceSchema: "openclaw-trajectory";
  schemaVersion: 1;
  traceId: string;
  source: TrajectoryEventSource;
  type: string;
  ts: string;
  seq: number;
  sourceSeq?: number;
  sessionId: string;
  sessionKey?: string;
  runId?: string;
  workspaceDir?: string;
  provider?: string;
  modelId?: string;
  modelApi?: string | null;
  entryId?: string;
  parentEntryId?: string | null;
  data?: Record<string, unknown>;
};

/** Manifest written beside exported trajectory bundle files. */
export type TrajectoryBundleManifest = {
  traceSchema: "openclaw-trajectory";
  schemaVersion: 1;
  generatedAt: string;
  traceId: string;
  sessionId: string;
  sessionKey?: string;
  workspaceDir: string;
  leafId: string | null;
  eventCount: number;
  runtimeEventCount: number;
  transcriptEventCount: number;
  sourceFiles: {
    session: string;
    runtime?: string;
  };
  contents?: Array<{
    path: string;
    mediaType: string;
    bytes: number;
  }>;
  supplementalFiles?: string[];
  warnings?: TrajectoryBundleWarning[];
};

/** Non-fatal parse or graph warning reported during trajectory export. */
export type TrajectoryBundleWarning = {
  source: "session" | "runtime";
  code:
    | "invalid-session-json"
    | "invalid-session-row"
    | "incomplete-session-branch"
    | "cyclic-session-branch"
    | "invalid-runtime-json"
    | "invalid-runtime-event";
  count: number;
  rows: number[];
  message: string;
};
