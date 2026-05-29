// Shared types for extensions/voice-call/src webhook types behavior.
export type WebhookResponsePayload = {
  statusCode: number;
  body: string;
  headers?: Record<string, string>;
};
