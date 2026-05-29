// Shared types for infra restart types behavior.
/** Shared type for Restart Attempt in src/infra. */
export type RestartAttempt = {
  ok: boolean;
  method: "launchctl" | "systemd" | "schtasks" | "supervisor";
  detail?: string;
  tried?: string[];
};
