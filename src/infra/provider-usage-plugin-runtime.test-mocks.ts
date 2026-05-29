// infra provider usage plugin runtime test mocks helpers and runtime behavior.
import { vi } from "vitest";

const resolveProviderUsageSnapshotWithPluginMock = vi.hoisted(() =>
  vi.fn<typeof import("../plugins/provider-runtime.js").resolveProviderUsageSnapshotWithPlugin>(
    async () => null,
  ),
);

vi.mock("../config/config.js", () => ({
  getRuntimeConfig: () => ({}),
}));

vi.mock("../plugins/provider-runtime.js", async () => {
  const actual = await vi.importActual<typeof import("../plugins/provider-runtime.js")>(
    "../plugins/provider-runtime.js",
  );
  return {
    ...actual,
    resolveProviderUsageSnapshotWithPlugin: resolveProviderUsageSnapshotWithPluginMock,
  };
});

/** Reused helper for reset Provider Usage Snapshot With Plugin Mock behavior in src/infra. */
export function resetProviderUsageSnapshotWithPluginMock() {
  resolveProviderUsageSnapshotWithPluginMock.mockReset();
  resolveProviderUsageSnapshotWithPluginMock.mockResolvedValue(null);
}

/** Reused helper for get Provider Usage Snapshot With Plugin Mock behavior in src/infra. */
export function getProviderUsageSnapshotWithPluginMock() {
  return resolveProviderUsageSnapshotWithPluginMock;
}
