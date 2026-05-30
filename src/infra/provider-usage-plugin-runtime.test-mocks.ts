// Vitest mocks for provider usage plugin runtime integration tests.
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

/** Resets the provider usage plugin resolver mock to return no plugin snapshot. */
export function resetProviderUsageSnapshotWithPluginMock() {
  resolveProviderUsageSnapshotWithPluginMock.mockReset();
  resolveProviderUsageSnapshotWithPluginMock.mockResolvedValue(null);
}

/** Returns the hoisted provider usage plugin resolver mock. */
export function getProviderUsageSnapshotWithPluginMock() {
  return resolveProviderUsageSnapshotWithPluginMock;
}
