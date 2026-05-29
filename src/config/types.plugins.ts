// Plugin config contracts for load policy, per-plugin permissions, and install records.
/** Per-plugin config entry controlling enablement, hook permissions, and plugin-owned config. */
export type PluginEntryConfig = {
  enabled?: boolean;
  hooks?: {
    /** Controls prompt mutation via before_prompt_build and prompt fields from legacy before_agent_start. */
    allowPromptInjection?: boolean;
    /**
     * Controls access to raw conversation content from conversation hooks including
     * before_agent_run, before_model_resolve, before_agent_reply, llm_input, llm_output,
     * before_agent_finalize, and agent_end.
     * Non-bundled plugins must opt in explicitly; bundled plugins stay allowed unless disabled.
     */
    allowConversationAccess?: boolean;
    /** Default timeout in milliseconds for this plugin's typed hooks. */
    timeoutMs?: number;
    /** Per typed-hook timeout overrides in milliseconds. */
    timeouts?: Record<string, number>;
  };
  subagent?: {
    /** Explicitly allow this plugin to request per-run provider/model overrides for subagent runs. */
    allowModelOverride?: boolean;
    /**
     * Allowed override targets as canonical provider/model refs.
     * Use "*" to explicitly allow any model for this plugin.
     */
    allowedModels?: string[];
  };
  llm?: {
    /** Explicitly allow this plugin to request a model override for api.runtime.llm.complete. */
    allowModelOverride?: boolean;
    /**
     * Allowed completion model override targets as canonical provider/model refs.
     * Use "*" to explicitly allow any model for this plugin.
     */
    allowedModels?: string[];
    /** Explicitly allow this plugin to run completions against a non-default agent id. */
    allowAgentIdOverride?: boolean;
  };
  config?: Record<string, unknown>;
};

/** Slot ownership config for plugin-provided singleton capabilities. */
export type PluginSlotsConfig = {
  /** Select which plugin owns the memory slot ("none" disables memory plugins). */
  memory?: string;
  /** Select which plugin owns the context-engine slot. */
  contextEngine?: string;
};

/** Additional plugin load roots outside the built-in registry. */
export type PluginsLoadConfig = {
  /** Additional plugin/extension paths to load. */
  paths?: string[];
};

/** Persisted plugin install record, including marketplace install provenance. */
export type PluginInstallRecord = Omit<InstallRecordBase, "source"> & {
  source: InstallRecordBase["source"] | "marketplace";
  marketplaceName?: string;
  marketplaceSource?: string;
  marketplacePlugin?: string;
};

/** Top-level plugin config block from `openclaw.json`. */
export type PluginsConfig = {
  /** Enable or disable plugin loading. */
  enabled?: boolean;
  /** Optional plugin allowlist (plugin ids). */
  allow?: string[];
  /** Optional plugin denylist (plugin ids). */
  deny?: string[];
  load?: PluginsLoadConfig;
  slots?: PluginSlotsConfig;
  entries?: Record<string, PluginEntryConfig>;
  /** @deprecated Shipped upgrade marker accepted for old restrictive allowlist configs. */
  bundledDiscovery?: "compat" | "allowlist";
  /**
   * Internal transient carrier for plugin install records during command flows.
   * This is intentionally omitted from the config schema and must not be
   * persisted to openclaw.json.
   */
  installs?: Record<string, PluginInstallRecord>;
};
import type { InstallRecordBase } from "./types.installs.js";
