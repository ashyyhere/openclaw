// Last-active-session settings helper.
import type { UiSettings } from "./storage.ts";

type LastActiveSessionHost = {
  settings: UiSettings;
  applySettings(next: UiSettings): void;
};

/** Persist the latest non-empty active session key into UI settings. */
export function setLastActiveSessionKey(host: LastActiveSessionHost, next: string) {
  const trimmed = next.trim();
  if (!trimmed || host.settings.lastActiveSessionKey === trimmed) {
    return;
  }
  host.applySettings({ ...host.settings, lastActiveSessionKey: trimmed });
}
