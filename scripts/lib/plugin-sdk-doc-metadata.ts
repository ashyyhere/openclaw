// Plugin SDK doc metadata classifies public entrypoints for generated documentation.
/** Documentation category assigned to public Plugin SDK entrypoints. */
export type PluginSdkDocCategory =
  | "channel"
  | "core"
  | "legacy"
  | "provider"
  | "runtime"
  | "utilities";

type PluginSdkDocMetadata = {
  category: PluginSdkDocCategory;
};

/** Metadata registry for Plugin SDK docs generation. */
export const pluginSdkDocMetadata = {
  index: {
    category: "legacy",
  },
  core: {
    category: "core",
  },
  health: {
    category: "core",
  },
  "approval-runtime": {
    category: "runtime",
  },
  "approval-auth-runtime": {
    category: "runtime",
  },
  "approval-client-runtime": {
    category: "runtime",
  },
  "approval-delivery-runtime": {
    category: "runtime",
  },
  "approval-native-runtime": {
    category: "runtime",
  },
  "approval-reaction-runtime": {
    category: "runtime",
  },
  "approval-reply-runtime": {
    category: "runtime",
  },
  "plugin-entry": {
    category: "core",
  },
  "access-groups": {
    category: "channel",
  },
  "channel-actions": {
    category: "channel",
  },
  "channel-config-schema": {
    category: "channel",
  },
  "channel-config-schema-legacy": {
    category: "channel",
  },
  "channel-contract": {
    category: "channel",
  },
  "channel-pairing": {
    category: "channel",
  },
  "channel-ingress": {
    category: "channel",
  },
  "channel-ingress-runtime": {
    category: "channel",
  },
  "channel-reply-pipeline": {
    category: "channel",
  },
  "channel-setup": {
    category: "channel",
  },
  "command-auth": {
    category: "channel",
  },
  zalouser: {
    category: "channel",
  },
  "command-status": {
    category: "channel",
  },
  "command-status-runtime": {
    category: "runtime",
  },
  "secret-input": {
    category: "channel",
  },
  "webhook-ingress": {
    category: "channel",
  },
  "provider-onboard": {
    category: "provider",
  },
  "provider-oauth-runtime": {
    category: "provider",
  },
  "provider-selection-runtime": {
    category: "provider",
  },
  "runtime-store": {
    category: "runtime",
  },
  "qa-live-transport-scenarios": {
    category: "utilities",
  },
  "agent-runtime": {
    category: "runtime",
  },
  "speech-core": {
    category: "provider",
  },
  "realtime-voice": {
    category: "provider",
  },
  "tts-runtime": {
    category: "runtime",
  },
  "inline-image-data-url-runtime": {
    category: "runtime",
  },
  "allow-from": {
    category: "utilities",
  },
  "reply-payload": {
    category: "utilities",
  },
} as const satisfies Record<string, PluginSdkDocMetadata>;

/** Public Plugin SDK entrypoint name covered by generated docs. */
export type PluginSdkDocEntrypoint = keyof typeof pluginSdkDocMetadata;

/** Resolves the import specifier displayed for one Plugin SDK doc entrypoint. */
export function resolvePluginSdkDocImportSpecifier(entrypoint: PluginSdkDocEntrypoint): string {
  return entrypoint === "index" ? "openclaw/plugin-sdk" : `openclaw/plugin-sdk/${entrypoint}`;
}
