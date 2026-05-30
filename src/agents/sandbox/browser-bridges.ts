import type { BrowserBridge } from "../../plugin-sdk/browser-bridge.js";

/** Process-local browser bridge registry keyed by sandbox/browser id. */
export const BROWSER_BRIDGES = new Map<
  string,
  {
    bridge: BrowserBridge;
    containerName: string;
    authToken?: string;
    authPassword?: string;
  }
>();
