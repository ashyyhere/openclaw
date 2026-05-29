// ui/src/ui app last active session helpers and runtime behavior.
import type { UiSettings } from "./storage.ts";

type LastActiveSessionHost = {
  settings: UiSettings;
  applySettings(next: UiSettings): void;
};

/** Reused helper for set Last Active Session Key behavior in ui/src/ui. */
export function setLastActiveSessionKey(host: LastActiveSessionHost, next: string) {
  const trimmed = next.trim();
  if (!trimmed || host.settings.lastActiveSessionKey === trimmed) {
    return;
  }
  host.applySettings({ ...host.settings, lastActiveSessionKey: trimmed });
}
