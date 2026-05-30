// Plugin-owned CLI backend contracts used by the generic CLI runner.
import type { CliBackendConfig } from "../config/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ContextEngineHostCapability } from "../context-engine/types.js";

/** One text replacement rule applied to CLI backend input or output. */
export type PluginTextReplacement = {
  from: string | RegExp;
  to: string;
};

/** Bidirectional text rewrite hooks supplied by CLI backend plugins. */
export type PluginTextTransforms = {
  /** Rewrites applied to outbound prompt text before provider/CLI transport. */
  input?: PluginTextReplacement[];
  /** Rewrites applied to inbound assistant text before OpenClaw consumes it. */
  output?: PluginTextReplacement[];
};

/** Supported strategies for injecting OpenClaw bundle MCP config into a CLI backend. */
export type CliBundleMcpMode =
  | "claude-config-file"
  | "codex-config-overrides"
  | "gemini-system-settings";

/** Context passed to backend-owned preparation before launching a CLI process. */
export type CliBackendPrepareExecutionContext = {
  config?: OpenClawConfig;
  workspaceDir: string;
  agentDir?: string;
  provider: string;
  modelId: string;
  authProfileId?: string;
};

/** Environment overrides and cleanup returned by CLI backend preparation. */
export type CliBackendPreparedExecution = {
  env?: Record<string, string>;
  clearEnv?: string[];
  cleanup?: () => Promise<void>;
};

/** Normalized thinking levels that CLI backends may translate to native flags. */
export type CliBackendThinkingLevel =
  | "off"
  | "minimal"
  | "low"
  | "medium"
  | "high"
  | "xhigh"
  | "adaptive"
  | "max";

/** Context passed when a CLI backend rewrites request-scoped process arguments. */
export type CliBackendResolveExecutionArgsContext = {
  config?: OpenClawConfig;
  workspaceDir: string;
  provider: string;
  modelId: string;
  authProfileId?: string;
  thinkingLevel?: CliBackendThinkingLevel;
  useResume: boolean;
  baseArgs: readonly string[];
};

/** Backend hook for replacing or declining the final CLI argv list. */
export type CliBackendResolveExecutionArgs = (
  ctx: CliBackendResolveExecutionArgsContext,
) => readonly string[] | null | undefined;

/** Session invalidation policy for host credentials versus OpenClaw auth profiles. */
export type CliBackendAuthEpochMode = "combined" | "profile-only";

/** Native tool availability advertised by a CLI backend outside OpenClaw's tool catalog. */
export type CliBackendNativeToolMode = "none" | "always-on";

/** Context supplied to backend-specific config normalizers after user overrides merge. */
export type CliBackendNormalizeConfigContext = {
  config?: OpenClawConfig;
  backendId: string;
  agentId?: string;
};

/** Plugin-owned CLI backend defaults used by the text-only CLI runner. */
export type CliBackendPlugin = {
  /** Provider id used in model refs, for example `claude-cli/opus`. */
  id: string;
  /** Canonical model provider whose models this CLI backend can execute. */
  modelProvider?: string;
  /** Default backend config before user overrides from `agents.defaults.cliBackends`. */
  config: CliBackendConfig;
  /**
   * Context-engine host capabilities provided by this backend when it is
   * driven through the generic CLI runner.
   */
  contextEngineHostCapabilities?: readonly ContextEngineHostCapability[];
  /**
   * Optional live-smoke metadata owned by the backend plugin.
   *
   * Keep provider-specific test wiring here instead of scattering it across
   * Docker wrappers, docs, and gateway live tests.
   */
  liveTest?: {
    defaultModelRef?: string;
    defaultImageProbe?: boolean;
    defaultMcpProbe?: boolean;
    docker?: {
      npmPackage?: string;
      binaryName?: string;
    };
  };
  /**
   * Whether OpenClaw should inject bundle MCP config for this backend.
   *
   * Keep this opt-in. Only backends that explicitly consume OpenClaw's bundle
   * MCP bridge should enable it.
   */
  bundleMcp?: boolean;
  /**
   * Provider-owned bundle MCP integration strategy.
   *
   * Different CLIs wire MCP through different surfaces:
   * - Claude: `--strict-mcp-config --mcp-config`
   * - Codex: `-c mcp_servers=...`
   * - Gemini: system-level `settings.json`
   */
  bundleMcpMode?: CliBundleMcpMode;
  /**
   * Optional config normalizer applied after user overrides merge.
   *
   * Use this for backend-specific compatibility rewrites when old config
   * shapes need to stay working.
   */
  normalizeConfig?: (
    config: CliBackendConfig,
    context?: CliBackendNormalizeConfigContext,
  ) => CliBackendConfig;
  /**
   * Backend-owned final system-prompt transform.
   *
   * Use this for tiny CLI-specific compatibility rewrites without replacing
   * the generic CLI runner or prompt builder.
   */
  transformSystemPrompt?: (ctx: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    provider: string;
    modelId: string;
    modelDisplay: string;
    agentId?: string;
    systemPrompt: string;
  }) => string | null | undefined;
  /**
   * Backend-owned bidirectional text replacements.
   *
   * `input` applies to the system prompt and user prompt passed to the CLI.
   * `output` applies to parsed/streamed assistant text from the CLI.
   */
  textTransforms?: PluginTextTransforms;
  /**
   * Preferred auth-profile id when the caller did not explicitly lock one.
   *
   * Use this when the backend should consume a canonical OpenClaw auth profile
   * rather than ambient host auth by default.
   */
  defaultAuthProfileId?: string;
  /**
   * Session/auth epoch source policy.
   *
   * `combined` keeps the legacy "host credential + auth profile" fingerprint.
   * `profile-only` treats the selected OpenClaw auth profile as the sole auth
   * owner for session invalidation when one is present.
   */
  authEpochMode?: CliBackendAuthEpochMode;
  /**
   * Backend-owned execution bridge.
   *
   * Use this on async run paths when the backend needs a generated auth/config
   * bridge (for example a private CLI home directory) without teaching the core
   * runner about provider-specific file formats.
   */
  prepareExecution?: (
    ctx: CliBackendPrepareExecutionContext,
  ) =>
    | Promise<CliBackendPreparedExecution | null | undefined>
    | CliBackendPreparedExecution
    | null
    | undefined;
  /**
   * Backend-owned per-run argv rewrite.
   *
   * Use this for request-scoped CLI dialect flags that should not be modeled
   * as static config, such as mapping OpenClaw thinking levels to a backend's
   * native effort flag.
   */
  resolveExecutionArgs?: CliBackendResolveExecutionArgs;
  /**
   * Whether this CLI backend can expose native tools outside OpenClaw's tool
   * catalog. Backends that cannot provide a true no-tools mode must mark
   * themselves as `always-on` so callers that require disabled tools fail
   * closed instead of launching a native harness.
   */
  nativeToolMode?: CliBackendNativeToolMode;
};
