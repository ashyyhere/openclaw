// Shared types for plugins channel registry state types behavior.
/** Shared type for Active Channel Plugin Runtime Shape in src/plugins. */
export type ActiveChannelPluginRuntimeShape = {
  id?: string | null;
  meta?: {
    aliases?: readonly string[];
    markdownCapable?: boolean;
    order?: number;
  } | null;
  messaging?: {
    targetPrefixes?: readonly string[];
  } | null;
  capabilities?: {
    nativeCommands?: boolean;
  } | null;
  conversationBindings?: {
    supportsCurrentConversationBinding?: boolean;
  } | null;
};

/** Shared type for Active Plugin Channel Registration in src/plugins. */
export type ActivePluginChannelRegistration = {
  plugin: ActiveChannelPluginRuntimeShape;
  pluginId?: string | null;
  origin?: string | null;
};

/** Shared type for Active Plugin Channel Registry in src/plugins. */
export type ActivePluginChannelRegistry = {
  channels: ActivePluginChannelRegistration[];
};
