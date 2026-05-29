/** Default sandbox paths, image names, ports, and tool policies. */
import path from "node:path";
import { CHANNEL_IDS } from "../../channels/ids.js";
import { STATE_DIR } from "../../config/paths.js";

/** Reused constant for DEFAULT SANDBOX WORKSPACE ROOT behavior in src/agents/sandbox. */
export const DEFAULT_SANDBOX_WORKSPACE_ROOT = path.join(STATE_DIR, "sandboxes");

/** Reused constant for DEFAULT SANDBOX IMAGE behavior in src/agents/sandbox. */
export const DEFAULT_SANDBOX_IMAGE = "openclaw-sandbox:bookworm-slim";
/** Reused constant for DEFAULT SANDBOX CONTAINER PREFIX behavior in src/agents/sandbox. */
export const DEFAULT_SANDBOX_CONTAINER_PREFIX = "openclaw-sbx-";
/** Reused constant for DEFAULT SANDBOX WORKDIR behavior in src/agents/sandbox. */
export const DEFAULT_SANDBOX_WORKDIR = "/workspace";
/** Reused constant for DEFAULT SANDBOX IDLE HOURS behavior in src/agents/sandbox. */
export const DEFAULT_SANDBOX_IDLE_HOURS = 24;
/** Reused constant for DEFAULT SANDBOX MAX AGE DAYS behavior in src/agents/sandbox. */
export const DEFAULT_SANDBOX_MAX_AGE_DAYS = 7;

/** Reused constant for DEFAULT TOOL ALLOW behavior in src/agents/sandbox. */
export const DEFAULT_TOOL_ALLOW = [
  "exec",
  "process",
  "read",
  "write",
  "edit",
  "apply_patch",
  "image",
  "sessions_list",
  "sessions_history",
  "sessions_send",
  "sessions_spawn",
  "sessions_yield",
  "subagents",
  "session_status",
] as const;

// Provider docking: keep sandbox policy aligned with provider tool names.
/** Reused constant for DEFAULT TOOL DENY behavior in src/agents/sandbox. */
export const DEFAULT_TOOL_DENY = [
  "browser",
  "canvas",
  "nodes",
  "cron",
  "gateway",
  ...CHANNEL_IDS,
] as const;

/** Reused constant for DEFAULT SANDBOX BROWSER IMAGE behavior in src/agents/sandbox. */
export const DEFAULT_SANDBOX_BROWSER_IMAGE = "openclaw-sandbox-browser:bookworm-slim";
/** Reused constant for DEFAULT SANDBOX COMMON IMAGE behavior in src/agents/sandbox. */
export const DEFAULT_SANDBOX_COMMON_IMAGE = "openclaw-sandbox-common:bookworm-slim";
/** Reused constant for SANDBOX BROWSER SECURITY HASH EPOCH behavior in src/agents/sandbox. */
export const SANDBOX_BROWSER_SECURITY_HASH_EPOCH = "2026-05-12-cdp-relay-auth";
/** Reused constant for SANDBOX BROWSER IMAGE CONTRACT EPOCH behavior in src/agents/sandbox. */
export const SANDBOX_BROWSER_IMAGE_CONTRACT_EPOCH = "2026-05-12-cdp-relay-auth";

/** Reused constant for DEFAULT SANDBOX BROWSER PREFIX behavior in src/agents/sandbox. */
export const DEFAULT_SANDBOX_BROWSER_PREFIX = "openclaw-sbx-browser-";
/** Reused constant for DEFAULT SANDBOX BROWSER NETWORK behavior in src/agents/sandbox. */
export const DEFAULT_SANDBOX_BROWSER_NETWORK = "openclaw-sandbox-browser";
/** Reused constant for DEFAULT SANDBOX BROWSER CDP PORT behavior in src/agents/sandbox. */
export const DEFAULT_SANDBOX_BROWSER_CDP_PORT = 9222;
/** Reused constant for DEFAULT SANDBOX BROWSER VNC PORT behavior in src/agents/sandbox. */
export const DEFAULT_SANDBOX_BROWSER_VNC_PORT = 5900;
/** Reused constant for DEFAULT SANDBOX BROWSER NOVNC PORT behavior in src/agents/sandbox. */
export const DEFAULT_SANDBOX_BROWSER_NOVNC_PORT = 6080;
/** Reused constant for DEFAULT SANDBOX BROWSER AUTOSTART TIMEOUT MS behavior in src/agents/sandbox. */
export const DEFAULT_SANDBOX_BROWSER_AUTOSTART_TIMEOUT_MS = 12_000;

/** Reused constant for SANDBOX AGENT WORKSPACE MOUNT behavior in src/agents/sandbox. */
export const SANDBOX_AGENT_WORKSPACE_MOUNT = "/agent";

/** Reused constant for SANDBOX STATE DIR behavior in src/agents/sandbox. */
export const SANDBOX_STATE_DIR = path.join(STATE_DIR, "sandbox");
/** Reused constant for SANDBOX REGISTRY PATH behavior in src/agents/sandbox. */
export const SANDBOX_REGISTRY_PATH = path.join(SANDBOX_STATE_DIR, "containers.json");
/** Reused constant for SANDBOX BROWSER REGISTRY PATH behavior in src/agents/sandbox. */
export const SANDBOX_BROWSER_REGISTRY_PATH = path.join(SANDBOX_STATE_DIR, "browsers.json");
/** Reused constant for SANDBOX CONTAINERS DIR behavior in src/agents/sandbox. */
export const SANDBOX_CONTAINERS_DIR = path.join(SANDBOX_STATE_DIR, "containers");
/** Reused constant for SANDBOX BROWSERS DIR behavior in src/agents/sandbox. */
export const SANDBOX_BROWSERS_DIR = path.join(SANDBOX_STATE_DIR, "browsers");
