// Detects SSH, container, codespace, and headless Linux remote environments.
import { isWSLEnv } from "./wsl.js";

/** Returns true when the current process likely lacks a local desktop session. */
export function isRemoteEnvironment(): boolean {
  if (process.env.SSH_CLIENT || process.env.SSH_TTY || process.env.SSH_CONNECTION) {
    return true;
  }

  if (process.env.REMOTE_CONTAINERS || process.env.CODESPACES) {
    return true;
  }

  if (
    process.platform === "linux" &&
    !process.env.DISPLAY &&
    !process.env.WAYLAND_DISPLAY &&
    !isWSLEnv()
  ) {
    return true;
  }

  return false;
}
