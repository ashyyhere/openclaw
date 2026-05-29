// Shared types for ui/src/ui chat model ref types behavior.
/** Shared type for Chat Model Override in ui/src/ui. */
export type ChatModelOverride =
  | {
      kind: "qualified";
      value: string;
    }
  | {
      kind: "raw";
      value: string;
    };
