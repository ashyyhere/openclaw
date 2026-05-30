/** Default sandbox paths, image names, ports, and tool policies. */
import path from "node:path";
import { CHANNEL_IDS } from "../../channels/ids.js";
import { STATE_DIR } from "../../config/paths.js";

/** Root directory where per-sandbox workspaces are created. */
export const DEFAULT_SANDBOX_WORKSPACE_ROOT = path.join(STATE_DIR, "sandboxes");

/** Default Docker image for non-browser agent sandboxes. */
export const DEFAULT_SANDBOX_IMAGE = "openclaw-sandbox:bookworm-slim";
/** Prefix used when naming agent sandbox containers. */
export const DEFAULT_SANDBOX_CONTAINER_PREFIX = "openclaw-sbx-";
/** Working directory mounted inside agent sandbox containers. */
export const DEFAULT_SANDBOX_WORKDIR = "/workspace";
/** Idle timeout before sandbox cleanup considers a container stale. */
export const DEFAULT_SANDBOX_IDLE_HOURS = 24;
/** Maximum sandbox container age before cleanup. */
export const DEFAULT_SANDBOX_MAX_AGE_DAYS = 7;

/** Default tool families allowed inside an agent sandbox. */
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
/** Default tool families denied inside an agent sandbox. */
export const DEFAULT_TOOL_DENY = [
  "browser",
  "canvas",
  "nodes",
  "cron",
  "gateway",
  ...CHANNEL_IDS,
] as const;

/** Default Docker image for browser sandbox containers. */
export const DEFAULT_SANDBOX_BROWSER_IMAGE = "openclaw-sandbox-browser:bookworm-slim";
/** Shared base Docker image tag used by sandbox image builds. */
export const DEFAULT_SANDBOX_COMMON_IMAGE = "openclaw-sandbox-common:bookworm-slim";
/** Security epoch folded into browser sandbox hash inputs. */
export const SANDBOX_BROWSER_SECURITY_HASH_EPOCH = "2026-05-12-cdp-relay-auth";
/** Contract epoch used to invalidate incompatible browser sandbox images. */
export const SANDBOX_BROWSER_IMAGE_CONTRACT_EPOCH = "2026-05-12-cdp-relay-auth";

/** Prefix used when naming browser sandbox containers. */
export const DEFAULT_SANDBOX_BROWSER_PREFIX = "openclaw-sbx-browser-";
/** Docker network name used by browser sandbox containers. */
export const DEFAULT_SANDBOX_BROWSER_NETWORK = "openclaw-sandbox-browser";
/** Browser sandbox Chrome DevTools Protocol port. */
export const DEFAULT_SANDBOX_BROWSER_CDP_PORT = 9222;
/** Browser sandbox VNC port. */
export const DEFAULT_SANDBOX_BROWSER_VNC_PORT = 5900;
/** Browser sandbox noVNC web port. */
export const DEFAULT_SANDBOX_BROWSER_NOVNC_PORT = 6080;
/** Timeout for browser sandbox automatic startup. */
export const DEFAULT_SANDBOX_BROWSER_AUTOSTART_TIMEOUT_MS = 12_000;

/** Container mount path for the agent workspace. */
export const SANDBOX_AGENT_WORKSPACE_MOUNT = "/agent";

/** State directory for sandbox registries and per-container metadata. */
export const SANDBOX_STATE_DIR = path.join(STATE_DIR, "sandbox");
/** Registry file for non-browser sandbox containers. */
export const SANDBOX_REGISTRY_PATH = path.join(SANDBOX_STATE_DIR, "containers.json");
/** Registry file for browser sandbox containers. */
export const SANDBOX_BROWSER_REGISTRY_PATH = path.join(SANDBOX_STATE_DIR, "browsers.json");
/** Metadata directory for non-browser sandbox containers. */
export const SANDBOX_CONTAINERS_DIR = path.join(SANDBOX_STATE_DIR, "containers");
/** Metadata directory for browser sandbox containers. */
export const SANDBOX_BROWSERS_DIR = path.join(SANDBOX_STATE_DIR, "browsers");
