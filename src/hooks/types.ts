/** Shared hook metadata and registry entry types. */
/** Install source descriptor for hook packs declared in hook metadata. */
export type HookInstallSpec = {
  id?: string;
  kind: "bundled" | "npm" | "git";
  label?: string;
  package?: string;
  repository?: string;
  bins?: string[];
};

/** Metadata parsed from HOOK.md frontmatter and OpenClaw hook manifests. */
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

/** Resolved invocation policy for a hook entry. */
export type HookInvocationPolicy = {
  enabled: boolean;
};

/** Parsed HOOK.md frontmatter key/value map. */
export type ParsedHookFrontmatter = Record<string, string>;

/** Discovered hook module with source and filesystem locations. */
export type Hook = {
  name: string;
  description: string;
  source: "openclaw-bundled" | "openclaw-managed" | "openclaw-workspace" | "openclaw-plugin";
  pluginId?: string;
  filePath: string; // Path to HOOK.md
  baseDir: string; // Directory containing hook
  handlerPath: string; // Path to handler module (handler.ts/js)
};

/** Source category for a discovered hook. */
export type HookSource = Hook["source"];

/** Loaded hook plus parsed metadata and resolved invocation policy. */
export type HookEntry = {
  hook: Hook;
  frontmatter: ParsedHookFrontmatter;
  metadata?: OpenClawHookMetadata;
  invocation?: HookInvocationPolicy;
};

/** Runtime facts used to evaluate whether a hook is eligible to load. */
export type HookEligibilityContext = {
  remote?: {
    platforms: string[];
    hasBin: (bin: string) => boolean;
    hasAnyBin: (bins: string[]) => boolean;
    note?: string;
  };
};
