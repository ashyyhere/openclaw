// gateway control ui contract helpers and runtime behavior.
/** Reused constant for CONTROL UI BOOTSTRAP CONFIG PATH behavior in src/gateway. */
export const CONTROL_UI_BOOTSTRAP_CONFIG_PATH = "/__openclaw/control-ui-config.json";

/** Shared type for Control Ui Embed Sandbox Mode in src/gateway. */
export type ControlUiEmbedSandboxMode = "strict" | "scripts" | "trusted";

/** Shared type for Control Ui Bootstrap Config in src/gateway. */
export type ControlUiBootstrapConfig = {
  basePath: string;
  assistantName: string;
  assistantAvatar: string;
  assistantAvatarSource?: string | null;
  assistantAvatarStatus?: "none" | "local" | "remote" | "data" | null;
  assistantAvatarReason?: string | null;
  assistantAgentId: string;
  serverVersion?: string;
  localMediaPreviewRoots?: string[];
  embedSandbox?: ControlUiEmbedSandboxMode;
  allowExternalEmbedUrls?: boolean;
  chatMessageMaxWidth?: string;
};
