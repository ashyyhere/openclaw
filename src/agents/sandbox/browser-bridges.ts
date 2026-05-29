/** Process-local registry of sandbox browser bridge instances. */
import type { BrowserBridge } from "../../plugin-sdk/browser-bridge.js";

/** Reused constant for BROWSER BRIDGES behavior in src/agents/sandbox. */
export const BROWSER_BRIDGES = new Map<
  string,
  {
    bridge: BrowserBridge;
    containerName: string;
    authToken?: string;
    authPassword?: string;
  }
>();
