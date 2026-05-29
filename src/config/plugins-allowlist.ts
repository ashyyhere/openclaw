// config plugins allowlist helpers and runtime behavior.
type PluginAllowlistConfigCarrier = {
  plugins?: {
    allow?: string[];
  };
};

/** Reused helper for ensure Plugin Allowlisted behavior in src/config. */
export function ensurePluginAllowlisted<T extends PluginAllowlistConfigCarrier>(
  cfg: T,
  pluginId: string,
): T {
  const allow = cfg.plugins?.allow;
  if (!Array.isArray(allow) || allow.includes(pluginId)) {
    return cfg;
  }
  return {
    ...cfg,
    plugins: {
      ...cfg.plugins,
      allow: [...allow, pluginId],
    },
  } as T;
}
