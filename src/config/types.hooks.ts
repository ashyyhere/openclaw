// Hook-related configuration contracts shared by config loading and hook runtimes.
/** Match criteria that selects a hook mapping from request path or source metadata. */
export type HookMappingMatch = {
  path?: string;
  source?: string;
};

/** Transform module/export reference used to preprocess matching hook payloads. */
export type HookMappingTransform = {
  module: string;
  export?: string;
};

/** Configured action, routing, and safety policy for one hook mapping. */
export type HookMappingConfig = {
  id?: string;
  match?: HookMappingMatch;
  action?: "wake" | "agent";
  wakeMode?: "now" | "next-heartbeat";
  name?: string;
  /** Route this hook to a specific agent (unknown ids fall back to the default agent). */
  agentId?: string;
  sessionKey?: string;
  messageTemplate?: string;
  textTemplate?: string;
  deliver?: boolean;
  /** DANGEROUS: Disable external content safety wrapping for this hook. */
  allowUnsafeExternalContent?: boolean;
  /**
   * "last" or any runtime channel id (including plugin channels).
   * Validation against configured/registered channels happens in gateway hooks runtime.
   */
  channel?: "last" | (string & {});
  to?: string;
  /** Override model for this hook (provider/model or alias). */
  model?: string;
  thinking?: string;
  timeoutSeconds?: number;
  transform?: HookMappingTransform;
};

/** Tailscale exposure mode for Gmail push hook receivers. */
export type HooksGmailTailscaleMode = "off" | "serve" | "funnel";

/** Gmail hook receiver configuration, Pub/Sub metadata, and model overrides. */
export type HooksGmailConfig = {
  account?: string;
  label?: string;
  topic?: string;
  subscription?: string;
  pushToken?: string;
  hookUrl?: string;
  includeBody?: boolean;
  maxBytes?: number;
  renewEveryMinutes?: number;
  /** DANGEROUS: Disable external content safety wrapping for Gmail hooks. */
  allowUnsafeExternalContent?: boolean;
  serve?: {
    bind?: string;
    port?: number;
    path?: string;
  };
  tailscale?: {
    mode?: HooksGmailTailscaleMode;
    path?: string;
    /** Optional tailscale serve/funnel target (port, host:port, or full URL). */
    target?: string;
  };
  /** Optional model override for Gmail hook processing (provider/model or alias). */
  model?: string;
  /** Optional thinking level override for Gmail hook processing. */
  thinking?: "off" | "minimal" | "low" | "medium" | "high";
};

/** Generic hook plugin config block keyed by hook id. */
export type HookConfig = {
  enabled?: boolean;
  env?: Record<string, string>;
  [key: string]: unknown;
};

/** Install record extension that lists hook ids provided by a pack. */
export type HookInstallRecord = InstallRecordBase & {
  hooks?: string[];
};

/** Internal hook subsystem config for installed packs and per-hook overrides. */
export type InternalHooksConfig = {
  /** Enable hooks system */
  enabled?: boolean;
  /** Per-hook configuration overrides */
  entries?: Record<string, HookConfig>;
  /** Load configuration */
  load?: {
    /** Additional hook directories to scan */
    extraDirs?: string[];
  };
  /** Install records for hook packs or hooks */
  installs?: Record<string, HookInstallRecord>;
};

/** Top-level hook config covering HTTP hook routing, presets, mappings, and Gmail. */
export type HooksConfig = {
  enabled?: boolean;
  path?: string;
  token?: string;
  /**
   * Default session key used for hook agent runs when no request/mapping session key is used.
   * If omitted, OpenClaw generates `hook:<uuid>` per request.
   */
  defaultSessionKey?: string;
  /**
   * Allow `sessionKey` from external `/hooks/agent` request payloads.
   * Default: false.
   */
  allowRequestSessionKey?: boolean;
  /**
   * Optional allowlist for explicit session keys (request + mapping). Example: ["hook:"].
   * Empty/omitted means no prefix restriction.
   */
  allowedSessionKeyPrefixes?: string[];
  /**
   * Restrict hook execution to these effective agent ids, including
   * default-agent routing when `agentId` is omitted. Omit or include `*` to
   * allow any agent. Set `[]` to deny all agent routing.
   */
  allowedAgentIds?: string[];
  maxBodyBytes?: number;
  presets?: string[];
  transformsDir?: string;
  mappings?: HookMappingConfig[];
  gmail?: HooksGmailConfig;
  /** Internal agent event hooks */
  internal?: InternalHooksConfig;
};
import type { InstallRecordBase } from "./types.installs.js";
