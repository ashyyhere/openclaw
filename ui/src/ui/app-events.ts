// Event-log entry shape shared by app state and event-log rendering.
/** One gateway/app event captured for the Control UI event log. */
export type EventLogEntry = {
  ts: number;
  event: string;
  payload?: unknown;
};
