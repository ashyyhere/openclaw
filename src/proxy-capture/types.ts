// Debug proxy capture record types shared by storage, coverage, and reporting.
/** Network protocol represented by a captured event. */
export type CaptureProtocol = "http" | "https" | "sse" | "ws" | "wss" | "connect";

/** Direction of captured traffic relative to OpenClaw. */
export type CaptureDirection = "outbound" | "inbound" | "local";

/** Event category stored for a proxy capture flow. */
export type CaptureEventKind =
  | "connect"
  | "tls-handshake"
  | "request"
  | "response"
  | "ws-open"
  | "ws-frame"
  | "ws-close"
  | "error"
  | "retry-link";

/** Persisted debug proxy capture session metadata. */
export type CaptureSessionRecord = {
  id: string;
  startedAt: number;
  endedAt?: number;
  mode: string;
  sourceScope: "openclaw";
  sourceProcess: string;
  proxyUrl?: string;
  dbPath: string;
  blobDir: string;
};

/** Metadata for a compressed captured payload blob. */
export type CaptureBlobRecord = {
  blobId: string;
  path: string;
  encoding: "gzip";
  sizeBytes: number;
  sha256: string;
  contentType?: string;
};

/** Persisted event row for HTTP, websocket, CONNECT, or local proxy errors. */
export type CaptureEventRecord = {
  sessionId: string;
  ts: number;
  sourceScope: "openclaw";
  sourceProcess: string;
  protocol: CaptureProtocol;
  direction: CaptureDirection;
  kind: CaptureEventKind;
  flowId: string;
  method?: string;
  host?: string;
  path?: string;
  status?: number;
  closeCode?: number;
  contentType?: string;
  headersJson?: string;
  dataText?: string;
  dataBlobId?: string;
  dataSha256?: string;
  errorText?: string;
  metaJson?: string;
};

/** Named diagnostic query preset supported by the capture store. */
export type CaptureQueryPreset =
  | "double-sends"
  | "retry-storms"
  | "cache-busting"
  | "ws-duplicate-frames"
  | "missing-ack"
  | "error-bursts";

/** Generic row shape returned by capture store query presets. */
export type CaptureQueryRow = Record<string, string | number | null>;

/** Compact capture session summary for lists and reports. */
export type CaptureSessionSummary = {
  id: string;
  startedAt: number;
  endedAt?: number;
  mode: string;
  sourceProcess: string;
  proxyUrl?: string;
  eventCount: number;
};

/** Counted dimension value observed in a capture session. */
export type CaptureObservedDimension = {
  value: string;
  count: number;
};

/** Coverage summary for labels/dimensions observed in one capture session. */
export type CaptureSessionCoverageSummary = {
  sessionId: string;
  totalEvents: number;
  unlabeledEventCount: number;
  providers: CaptureObservedDimension[];
  apis: CaptureObservedDimension[];
  models: CaptureObservedDimension[];
  hosts: CaptureObservedDimension[];
  localPeers: CaptureObservedDimension[];
};
