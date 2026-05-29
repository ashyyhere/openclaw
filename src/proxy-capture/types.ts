// Shared types for proxy-capture types behavior.
/** Shared type for Capture Protocol in src/proxy-capture. */
export type CaptureProtocol = "http" | "https" | "sse" | "ws" | "wss" | "connect";

/** Shared type for Capture Direction in src/proxy-capture. */
export type CaptureDirection = "outbound" | "inbound" | "local";

/** Shared type for Capture Event Kind in src/proxy-capture. */
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

/** Shared type for Capture Session Record in src/proxy-capture. */
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

/** Shared type for Capture Blob Record in src/proxy-capture. */
export type CaptureBlobRecord = {
  blobId: string;
  path: string;
  encoding: "gzip";
  sizeBytes: number;
  sha256: string;
  contentType?: string;
};

/** Shared type for Capture Event Record in src/proxy-capture. */
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

/** Shared type for Capture Query Preset in src/proxy-capture. */
export type CaptureQueryPreset =
  | "double-sends"
  | "retry-storms"
  | "cache-busting"
  | "ws-duplicate-frames"
  | "missing-ack"
  | "error-bursts";

/** Shared type for Capture Query Row in src/proxy-capture. */
export type CaptureQueryRow = Record<string, string | number | null>;

/** Shared type for Capture Session Summary in src/proxy-capture. */
export type CaptureSessionSummary = {
  id: string;
  startedAt: number;
  endedAt?: number;
  mode: string;
  sourceProcess: string;
  proxyUrl?: string;
  eventCount: number;
};

/** Shared type for Capture Observed Dimension in src/proxy-capture. */
export type CaptureObservedDimension = {
  value: string;
  count: number;
};

/** Shared type for Capture Session Coverage Summary in src/proxy-capture. */
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
