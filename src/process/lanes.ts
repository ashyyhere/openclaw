// process lanes helpers and runtime behavior.
/** Reused constant for enum behavior in src/process. */
export const enum CommandLane {
  Main = "main",
  Cron = "cron",
  CronNested = "cron-nested",
  Subagent = "subagent",
  Nested = "nested",
}
