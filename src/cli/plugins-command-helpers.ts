import { theme } from "../../packages/terminal-core/src/theme.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginKind } from "../plugins/plugin-kind.types.js";
import { loadPluginMetadataSnapshot } from "../plugins/plugin-metadata-snapshot.js";
import { applyExclusiveSlotSelection } from "../plugins/slots.js";
import { buildPluginDiagnosticsReport } from "../plugins/status.js";
import type { PluginLogger } from "../plugins/types.js";
import { defaultRuntime, type RuntimeEnv } from "../runtime.js";
import { normalizeLowercaseStringOrEmpty } from "../shared/string-coerce.js";

type HookInternalEntryLike = Record<string, unknown> & { enabled?: boolean };

/** Reused constant for quiet Plugin Json Logger behavior in src/cli. */
export const quietPluginJsonLogger: PluginLogger = {
  debug: () => undefined,
  info: () => undefined,
  warn: () => undefined,
  error: () => undefined,
};

type SlotSelectionPlugin = {
  id: string;
  kind?: PluginKind | PluginKind[];
};

type SlotSelectionRegistry = {
  plugins: SlotSelectionPlugin[];
};

function mergeRuntimeKinds(
  report: SlotSelectionRegistry,
  runtimeReport: SlotSelectionRegistry,
): SlotSelectionRegistry {
  const runtimeKinds = new Map(
    runtimeReport.plugins
      .filter((plugin) => plugin.kind)
      .map((plugin) => [plugin.id, plugin.kind] as const),
  );
  return {
    plugins: report.plugins.map((plugin) => {
      if (plugin.kind) {
        return plugin;
      }
      const runtimeKind = runtimeKinds.get(plugin.id);
      return runtimeKind ? { ...plugin, kind: runtimeKind } : plugin;
    }),
  };
}

function loadRuntimeKindReportForPlugins(config: OpenClawConfig, pluginIds: readonly string[]) {
  return buildPluginDiagnosticsReport({
    config,
    onlyPluginIds: [...pluginIds],
  });
}

function buildSlotSelectionRegistry(
  config: OpenClawConfig,
  pluginId: string,
): SlotSelectionRegistry {
  const plugins = loadPluginMetadataSnapshot({
    config,
    env: process.env,
  }).plugins.filter((plugin) => plugin.id === pluginId);
  return {
    plugins: plugins.map((plugin) => ({
      id: plugin.id,
      kind: plugin.kind,
    })),
  };
}

/** Reused helper for resolve File Npm Spec To Local Path behavior in src/cli. */
export function resolveFileNpmSpecToLocalPath(
  raw: string,
): { ok: true; path: string } | { ok: false; error: string } | null {
  const trimmed = raw.trim();
  if (!normalizeLowercaseStringOrEmpty(trimmed).startsWith("file:")) {
    return null;
  }
  const rest = trimmed.slice("file:".length);
  if (!rest) {
    return { ok: false, error: "unsupported file: spec: missing path" };
  }
  if (rest.startsWith("///")) {
    return { ok: true, path: rest.slice(2) };
  }
  if (rest.startsWith("//localhost/")) {
    return { ok: true, path: rest.slice("//localhost".length) };
  }
  if (rest.startsWith("//")) {
    return {
      ok: false,
      error: 'unsupported file: URL host (expected "file:<path>" or "file:///abs/path")',
    };
  }
  return { ok: true, path: rest };
}

/** Reused helper for apply Slot Selection For Plugin behavior in src/cli. */
export function applySlotSelectionForPlugin(
  config: OpenClawConfig,
  pluginId: string,
): { config: OpenClawConfig; warnings: string[] } {
  const report = buildSlotSelectionRegistry(config, pluginId);
  const plugin = report.plugins.find((entry) => entry.id === pluginId);
  if (!plugin) {
    return { config, warnings: [] };
  }
  if (!plugin.kind) {
    const runtimeReport = loadRuntimeKindReportForPlugins(config, [plugin.id]);
    const runtimePlugin = runtimeReport.plugins.find((entry) => entry.id === plugin.id);
    if (runtimePlugin?.kind) {
      const result = applyExclusiveSlotSelection({
        config,
        selectedId: runtimePlugin.id,
        selectedKind: runtimePlugin.kind,
        registry: mergeRuntimeKinds(report, runtimeReport),
      });
      return { config: result.config, warnings: result.warnings };
    }
  }
  const result = applyExclusiveSlotSelection({
    config,
    selectedId: plugin.id,
    selectedKind: plugin.kind,
    registry: report,
  });
  return { config: result.config, warnings: result.warnings };
}

/** Reused helper for create Plugin Install Logger behavior in src/cli. */
export function createPluginInstallLogger(runtime: RuntimeEnv = defaultRuntime): {
  info: (msg: string) => void;
  warn: (msg: string) => void;
} {
  return {
    info: (msg) => runtime.log(msg),
    warn: (msg) => runtime.log(theme.warn(msg)),
  };
}

/** Reused helper for create Hook Pack Install Logger behavior in src/cli. */
export function createHookPackInstallLogger(runtime: RuntimeEnv = defaultRuntime): {
  info: (msg: string) => void;
  warn: (msg: string) => void;
} {
  return {
    info: (msg) => runtime.log(msg),
    warn: (msg) => runtime.log(theme.warn(msg)),
  };
}

/** Reused helper for enable Internal Hook Entries behavior in src/cli. */
export function enableInternalHookEntries(
  config: OpenClawConfig,
  hookNames: string[],
): OpenClawConfig {
  const entries = { ...config.hooks?.internal?.entries } as Record<string, HookInternalEntryLike>;

  for (const hookName of hookNames) {
    entries[hookName] = {
      ...entries[hookName],
      enabled: true,
    };
  }

  return {
    ...config,
    hooks: {
      ...config.hooks,
      internal: {
        ...config.hooks?.internal,
        enabled: true,
        entries,
      },
    },
  };
}

/** Reused helper for format Plugin Install With Hook Fallback Error behavior in src/cli. */
export function formatPluginInstallWithHookFallbackError(
  pluginError: string,
  hookError: string,
): string {
  const formattedPluginError = formatPluginInstallAttemptError(pluginError);
  const formattedHookError = formatPluginInstallAttemptError(hookError);
  if (/plugin already exists: .+ \(delete it first\)/.test(pluginError)) {
    return `${formattedPluginError}\nUse \`openclaw plugins update <id-or-npm-spec>\` to upgrade the tracked plugin, or rerun install with \`--force\` to replace it.`;
  }
  if (
    pluginError.startsWith("Invalid extensions directory:") ||
    pluginError === "Invalid path: must stay within extensions directory"
  ) {
    return formattedPluginError;
  }
  return `${formattedPluginError}\nAlso not a valid hook pack: ${formattedHookError}`;
}

const MISSING_GIT_FOR_NPM_DEPENDENCY_HINT =
  "Git is required because one of this plugin's npm dependencies is fetched from a git URL, but `git` was not found on PATH. Install Git and rerun the install. On Windows, use `winget install --id Git.Git -e` or add a portable Git `bin` directory to PATH.";

function formatPluginInstallAttemptError(error: string): string {
  if (!isMissingGitForNpmDependencyError(error)) {
    return error;
  }
  if (error.includes(MISSING_GIT_FOR_NPM_DEPENDENCY_HINT)) {
    return error;
  }
  return `${error}\n\n${MISSING_GIT_FOR_NPM_DEPENDENCY_HINT}`;
}

function isMissingGitForNpmDependencyError(error: string): boolean {
  const normalized = normalizeLowercaseStringOrEmpty(error);
  return /\bspawn\s+git\b/u.test(normalized) && /\benoent\b/u.test(normalized);
}

/** Reused helper for log Hook Pack Restart Hint behavior in src/cli. */
export function logHookPackRestartHint(runtime: RuntimeEnv = defaultRuntime) {
  runtime.log("Restart the gateway to load hooks.");
}

/** Reused helper for log Slot Warnings behavior in src/cli. */
export function logSlotWarnings(warnings: string[], runtime: RuntimeEnv = defaultRuntime) {
  if (warnings.length === 0) {
    return;
  }
  for (const warning of warnings) {
    runtime.log(theme.warn(warning));
  }
}

/** Reused helper for parse Npm Prefix Spec behavior in src/cli. */
export function parseNpmPrefixSpec(raw: string): string | null {
  const trimmed = raw.trim();
  if (!normalizeLowercaseStringOrEmpty(trimmed).startsWith("npm:")) {
    return null;
  }
  return trimmed.slice("npm:".length).trim();
}

/** Reused helper for parse Npm Pack Prefix Path behavior in src/cli. */
export function parseNpmPackPrefixPath(raw: string): string | null {
  const trimmed = raw.trim();
  if (!normalizeLowercaseStringOrEmpty(trimmed).startsWith("npm-pack:")) {
    return null;
  }
  return trimmed.slice("npm-pack:".length).trim();
}
