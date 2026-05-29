// Shared types for hooks types behavior.
/** Shared type for Hook Install Spec in src/hooks. */
export type HookInstallSpec = {
  id?: string;
  kind: "bundled" | "npm" | "git";
  label?: string;
  package?: string;
  repository?: string;
  bins?: string[];
};

/** Shared type for Open Claw Hook Metadata in src/hooks. */
export type OpenClawHookMetadata = {
  always?: boolean;
  hookKey?: string;
  emoji?: string;
  homepage?: string;
  /** Events this hook handles (e.g., ["command:new", "session:start"]) */
  events: string[];
  /** Optional export name (default: "default") */
  export?: string;
  os?: string[];
  requires?: {
    bins?: string[];
    anyBins?: string[];
    env?: string[];
    config?: string[];
  };
  install?: HookInstallSpec[];
};

/** Shared type for Hook Invocation Policy in src/hooks. */
export type HookInvocationPolicy = {
  enabled: boolean;
};

/** Shared type for Parsed Hook Frontmatter in src/hooks. */
export type ParsedHookFrontmatter = Record<string, string>;

/** Shared type for Hook in src/hooks. */
export type Hook = {
  name: string;
  description: string;
  source: "openclaw-bundled" | "openclaw-managed" | "openclaw-workspace" | "openclaw-plugin";
  pluginId?: string;
  filePath: string; // Path to HOOK.md
  baseDir: string; // Directory containing hook
  handlerPath: string; // Path to handler module (handler.ts/js)
};

/** Shared type for Hook Source in src/hooks. */
export type HookSource = Hook["source"];

/** Shared type for Hook Entry in src/hooks. */
export type HookEntry = {
  hook: Hook;
  frontmatter: ParsedHookFrontmatter;
  metadata?: OpenClawHookMetadata;
  invocation?: HookInvocationPolicy;
};

/** Shared type for Hook Eligibility Context in src/hooks. */
export type HookEligibilityContext = {
  remote?: {
    platforms: string[];
    hasBin: (bin: string) => boolean;
    hasAnyBin: (bins: string[]) => boolean;
    note?: string;
  };
};
