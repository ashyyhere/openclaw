// ui/src/ui app events helpers and runtime behavior.
/** Shared type for Event Log Entry in ui/src/ui. */
export type EventLogEntry = {
  ts: number;
  event: string;
  payload?: unknown;
};
