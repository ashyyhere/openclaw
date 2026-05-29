// Stored chat model override shapes shared by UI state and chat-model helpers.
/** Chat model override stored as either raw user text or provider-qualified value. */
export type ChatModelOverride =
  | {
      kind: "qualified";
      value: string;
    }
  | {
      kind: "raw";
      value: string;
    };
