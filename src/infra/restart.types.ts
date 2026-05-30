// Shared restart attempt result types.
/** Result from one platform-specific restart strategy. */
export type RestartAttempt = {
  ok: boolean;
  method: "launchctl" | "systemd" | "schtasks" | "supervisor";
  detail?: string;
  tried?: string[];
};
