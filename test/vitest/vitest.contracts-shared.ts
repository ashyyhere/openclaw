// Shared contract Vitest helpers group channel and plugin contract test patterns.
import path from "node:path";
import { defineConfig } from "vitest/config";
import { loadPatternListFromEnv, narrowIncludePatternsForCli } from "./vitest.pattern-file.ts";
import { nonIsolatedRunnerPath, sharedVitestConfig } from "./vitest.shared.config.ts";

const base = sharedVitestConfig as Record<string, unknown>;
const baseTest = sharedVitestConfig.test ?? {};

/** Contract tests for channel public surface and import guardrails. */
export const channelSurfaceContractPatterns = [
  "src/channels/plugins/contracts/channel-catalog.contract.test.ts",
  "src/channels/plugins/contracts/channel-import-guardrails.test.ts",
  "src/channels/plugins/contracts/group-policy.fallback.contract.test.ts",
  "src/channels/plugins/contracts/outbound-payload.contract.test.ts",
  "src/channels/plugins/contracts/*-shard-a.contract.test.ts",
  "src/channels/plugins/contracts/*-shard-e.contract.test.ts",
];

/** Contract tests for channel config authorization and catalog entries. */
export const channelConfigContractPatterns = [
  "src/channels/plugins/contracts/plugins-core.authorize-config-write.policy.contract.test.ts",
  "src/channels/plugins/contracts/plugins-core.authorize-config-write.targets.contract.test.ts",
  "src/channels/plugins/contracts/plugins-core.catalog.entries.contract.test.ts",
  "src/channels/plugins/contracts/*-shard-b.contract.test.ts",
  "src/channels/plugins/contracts/*-shard-f.contract.test.ts",
];

/** Contract tests for plugin loader, registry, and catalog paths. */
export const channelRegistryContractPatterns = [
  "src/channels/plugins/contracts/plugins-core.catalog.paths.contract.test.ts",
  "src/channels/plugins/contracts/plugins-core.loader.contract.test.ts",
  "src/channels/plugins/contracts/plugins-core.registry.contract.test.ts",
  "src/channels/plugins/contracts/*-shard-c.contract.test.ts",
  "src/channels/plugins/contracts/*-shard-g.contract.test.ts",
];

/** Contract tests for session binding and config write resolution. */
export const channelSessionContractPatterns = [
  "src/channels/plugins/contracts/plugins-core.resolve-config-writes.contract.test.ts",
  "src/channels/plugins/contracts/registry.contract.test.ts",
  "src/channels/plugins/contracts/session-binding.registry-backed.contract.test.ts",
  "src/channels/plugins/contracts/*-shard-d.contract.test.ts",
  "src/channels/plugins/contracts/*-shard-h.contract.test.ts",
];

/** Contract tests covering core plugin behavior. */
export const pluginContractPatterns = ["src/plugins/contracts/**/*.test.ts"];

/** Loads optional contract include patterns from an env-provided pattern file. */
export function loadContractsIncludePatternsFromEnv(
  env: Record<string, string | undefined> = process.env,
): string[] | null {
  return loadPatternListFromEnv("OPENCLAW_VITEST_INCLUDE_FILE", env);
}

function narrowContractIncludePatterns(
  includePatterns: string[],
  candidatePatterns: string[] | null,
): string[] | null {
  if (!candidatePatterns) {
    return null;
  }

  return [
    ...new Set(
      candidatePatterns.filter((candidate) =>
        includePatterns.some(
          (pattern) => path.matchesGlob(candidate, pattern) || path.matchesGlob(pattern, candidate),
        ),
      ),
    ),
  ];
}

/** Creates a non-isolated Vitest project config for a contract test pattern set. */
export function createContractsVitestConfig(
  includePatterns: string[],
  env: Record<string, string | undefined> = process.env,
  argv: string[] = process.argv,
  options: { name?: string } = {},
) {
  const cliIncludePatterns = narrowIncludePatternsForCli(includePatterns, argv);
  const envIncludePatterns = narrowContractIncludePatterns(
    includePatterns,
    loadContractsIncludePatternsFromEnv(env),
  );
  return defineConfig({
    ...base,
    test: {
      ...baseTest,
      name: options.name ?? "contracts",
      isolate: false,
      runner: nonIsolatedRunnerPath,
      setupFiles: baseTest.setupFiles ?? [],
      include: envIncludePatterns ?? cliIncludePatterns ?? includePatterns,
      passWithNoTests: true,
    },
  });
}
