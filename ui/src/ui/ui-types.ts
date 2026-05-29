// Shared Control UI state shapes that are consumed across chat, cron, and
// scheduling views. Keep these lightweight data contracts free of rendering
// concerns so reducers and view helpers can share them.
/** Attachment metadata plus optional in-memory object URLs for chat drafts. */
export type ChatAttachment = {
  id: string;
  dataUrl?: string;
  previewUrl?: string;
  mimeType: string;
  fileName?: string;
  sizeBytes?: number;
};

/** Pending chat send item tracked while the gateway is busy or disconnected. */
export type ChatQueueItem = {
  id: string;
  text: string;
  createdAt: number;
  kind?: "queued" | "steered";
  attachments?: ChatAttachment[];
  refreshSessions?: boolean;
  localCommandArgs?: string;
  localCommandName?: string;
  pendingRunId?: string;
  sendAttempts?: number;
  sendError?: string;
  sendRunId?: string;
  sendState?: "sending" | "waiting-reconnect" | "failed";
  sessionKey?: string;
  agentId?: string;
};

/** Sentinel meaning a cron job should reuse the last active channel target. */
export const CRON_CHANNEL_LAST = "last";

/** Complete editable state for the cron/scheduled-run form. */
export type CronFormState = {
  name: string;
  description: string;
  agentId: string;
  sessionKey: string;
  clearAgent: boolean;
  enabled: boolean;
  deleteAfterRun: boolean;
  scheduleKind: "at" | "every" | "cron";
  scheduleAt: string;
  everyAmount: string;
  everyUnit: "minutes" | "hours" | "days";
  cronExpr: string;
  cronTz: string;
  scheduleExact: boolean;
  staggerAmount: string;
  staggerUnit: "seconds" | "minutes";
  sessionTarget: "main" | "isolated" | "current" | `session:${string}`;
  wakeMode: "next-heartbeat" | "now";
  payloadKind: "systemEvent" | "agentTurn";
  payloadText: string;
  payloadModel: string;
  payloadThinking: string;
  payloadLightContext: boolean;
  deliveryMode: "none" | "announce" | "webhook";
  deliveryChannel: string;
  deliveryTo: string;
  deliveryAccountId: string;
  deliveryBestEffort: boolean;
  failureAlertMode: "inherit" | "disabled" | "custom";
  failureAlertAfter: string;
  failureAlertCooldownSeconds: string;
  failureAlertChannel: string;
  failureAlertTo: string;
  failureAlertDeliveryMode: "announce" | "webhook";
  failureAlertAccountId: string;
  timeoutSeconds: string;
};
