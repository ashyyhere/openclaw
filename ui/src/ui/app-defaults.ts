// Default UI state used when filters and cron forms have no persisted value.
import type { LogLevel } from "./types.ts";
import type { CronFormState } from "./ui-types.ts";

/** Initial enabled log levels for the logs tab. */
export const DEFAULT_LOG_LEVEL_FILTERS: Record<LogLevel, boolean> = {
  trace: true,
  debug: true,
  info: true,
  warn: true,
  error: true,
  fatal: true,
};

/** Initial sessions-query filters for the sessions tab. */
export const DEFAULT_SESSIONS_FILTERS = {
  activeMinutes: "120",
  limit: "200",
} as const;

/** Empty cron editor state used for creating a new schedule. */
export const DEFAULT_CRON_FORM: CronFormState = {
  name: "",
  description: "",
  agentId: "",
  sessionKey: "",
  clearAgent: false,
  enabled: true,
  deleteAfterRun: true,
  scheduleKind: "every",
  scheduleAt: "",
  everyAmount: "30",
  everyUnit: "minutes",
  cronExpr: "0 7 * * *",
  cronTz: "",
  scheduleExact: false,
  staggerAmount: "",
  staggerUnit: "seconds",
  sessionTarget: "isolated",
  wakeMode: "now",
  payloadKind: "agentTurn",
  payloadText: "",
  payloadModel: "",
  payloadThinking: "",
  payloadLightContext: false,
  deliveryMode: "announce",
  deliveryChannel: "last",
  deliveryTo: "",
  deliveryAccountId: "",
  deliveryBestEffort: false,
  failureAlertMode: "inherit",
  failureAlertAfter: "2",
  failureAlertCooldownSeconds: "3600",
  failureAlertChannel: "last",
  failureAlertTo: "",
  failureAlertDeliveryMode: "announce",
  failureAlertAccountId: "",
  timeoutSeconds: "",
};
