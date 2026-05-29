/** Canonical Plugin SDK entrypoint lists used by package exports, docs, and dist checks. */
import deprecatedBarrelPluginSdkSubpathList from "../../scripts/lib/plugin-sdk-deprecated-barrel-subpaths.json" with { type: "json" };
import deprecatedPublicPluginSdkSubpathList from "../../scripts/lib/plugin-sdk-deprecated-public-subpaths.json" with { type: "json" };
import pluginSdkEntryList from "../../scripts/lib/plugin-sdk-entrypoints.json" with { type: "json" };
import privateLocalOnlyPluginSdkSubpathList from "../../scripts/lib/plugin-sdk-private-local-only-subpaths.json" with { type: "json" };

/** Every generated Plugin SDK entrypoint, including root index. */
export const pluginSdkEntrypoints = [...pluginSdkEntryList];

/** Reused constant for plugin Sdk Subpaths behavior in src/plugin-sdk. */
export const pluginSdkSubpaths = pluginSdkEntrypoints.filter((entry) => entry !== "index");

const privateLocalOnlyPluginSdkSubpathSet = new Set<string>(
  privateLocalOnlyPluginSdkSubpathList.filter(
    (entry): entry is string => typeof entry === "string" && !entry.includes("/"),
  ),
);

/** Reused constant for private Local Only Plugin Sdk Entrypoints behavior in src/plugin-sdk. */
export const privateLocalOnlyPluginSdkEntrypoints = pluginSdkSubpaths.filter((entry) =>
  privateLocalOnlyPluginSdkSubpathSet.has(entry),
);

/** Entrypoints that are public API rather than local/test/private seams. */
export const publicPluginSdkEntrypoints = pluginSdkEntrypoints.filter(
  (entry) => entry === "index" || !privateLocalOnlyPluginSdkSubpathSet.has(entry),
);

/** Reused constant for public Plugin Sdk Subpaths behavior in src/plugin-sdk. */
export const publicPluginSdkSubpaths = publicPluginSdkEntrypoints.filter(
  (entry) => entry !== "index",
);

/** Reused constant for deprecated Public Plugin Sdk Entrypoints behavior in src/plugin-sdk. */
export const deprecatedPublicPluginSdkEntrypoints = publicPluginSdkSubpaths.filter((entry) =>
  deprecatedPublicPluginSdkSubpathList.includes(entry),
);

/** Reused constant for deprecated Barrel Plugin Sdk Entrypoints behavior in src/plugin-sdk. */
export const deprecatedBarrelPluginSdkEntrypoints = pluginSdkSubpaths.filter((entry) =>
  deprecatedBarrelPluginSdkSubpathList.includes(entry),
);

// Transitional compatibility/helper surfaces owned by their matching bundled plugin.
// Cross-owner extension imports are blocked by the package contract guardrails.
/** Reused constant for reserved Bundled Plugin Sdk Entrypoints behavior in src/plugin-sdk. */
export const reservedBundledPluginSdkEntrypoints = ["codex-mcp-projection"] as const;

// Supported SDK facades backed by bundled plugins. These are intentionally public
// until they move to generic, plugin-neutral contracts.
/** Reused constant for supported Bundled Facade Sdk Entrypoints behavior in src/plugin-sdk. */
export const supportedBundledFacadeSdkEntrypoints = [
  "discord",
  "lmstudio",
  "lmstudio-runtime",
  "matrix",
  "mattermost",
  "memory-core-engine-runtime",
  "provider-zai-endpoint",
  "qa-runner-runtime",
  "telegram-account",
  "tts-runtime",
  "zalouser",
] as const;

// Plugin-owned surfaces that are intentionally public and documented for third-party plugins.
/** Reused constant for public Plugin Owned Sdk Entrypoints behavior in src/plugin-sdk. */
export const publicPluginOwnedSdkEntrypoints = [
  "browser-config",
  "image-generation-core",
  "memory-core",
  "memory-core-host-engine-embeddings",
  "memory-core-host-engine-foundation",
  "memory-core-host-engine-qmd",
  "memory-core-host-engine-storage",
  "memory-core-host-events",
  "memory-core-host-multimodal",
  "memory-core-host-query",
  "memory-core-host-runtime-cli",
  "memory-core-host-runtime-core",
  "memory-core-host-runtime-files",
  "memory-core-host-secret",
  "memory-core-host-status",
  "memory-host-core",
  "memory-host-events",
  "memory-host-files",
  "memory-host-markdown",
  "memory-host-search",
  "memory-host-status",
  "speech-core",
  "telegram-command-config",
  "video-generation-core",
] as const;

/** Map every SDK entrypoint name to its source file path inside the repo. */
/** Build source-file paths for Plugin SDK entrypoints. */
export function buildPluginSdkEntrySources(entries: readonly string[] = pluginSdkEntrypoints) {
  return Object.fromEntries(entries.map((entry) => [entry, `src/plugin-sdk/${entry}.ts`]));
}

/** List the public package specifiers that should resolve to plugin SDK entrypoints. */
/** Build package import specifiers for public Plugin SDK entrypoints. */
export function buildPluginSdkSpecifiers() {
  return publicPluginSdkEntrypoints.map((entry) =>
    entry === "index" ? "openclaw/plugin-sdk" : `openclaw/plugin-sdk/${entry}`,
  );
}

/** Build the package.json exports map for public plugin SDK subpaths. */
/** Build package.json exports for the Plugin SDK entrypoint set. */
export function buildPluginSdkPackageExports() {
  return Object.fromEntries(
    publicPluginSdkEntrypoints.map((entry) => [
      entry === "index" ? "./plugin-sdk" : `./plugin-sdk/${entry}`,
      {
        types: `./dist/plugin-sdk/${entry}.d.ts`,
        default: `./dist/plugin-sdk/${entry}.js`,
      },
    ]),
  );
}

/** List the dist artifacts expected for every generated plugin SDK entrypoint. */
export function listPluginSdkDistArtifacts() {
  return publicPluginSdkEntrypoints.flatMap((entry) => [
    `dist/plugin-sdk/${entry}.js`,
    `dist/plugin-sdk/${entry}.d.ts`,
  ]);
}
