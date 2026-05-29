// gateway server helpers and runtime behavior.
/** Re-exported API for src/gateway, starting with truncate Close Reason. */
export { truncateCloseReason } from "./server/close-reason.js";
/** Re-exported API for src/gateway, starting with Gateway Server. */
export type { GatewayServer, GatewayServerOptions } from "./server.impl.js";

function emitStartupTrace(name: string, durationMs: number, totalMs: number): void {
  if (!process.env.OPENCLAW_GATEWAY_STARTUP_TRACE) {
    return;
  }
  process.stderr.write(
    `[gateway] startup trace: ${name} ${durationMs.toFixed(1)}ms total=${totalMs.toFixed(1)}ms\n`,
  );
}

async function loadServerImpl() {
  const startupStartedAt = performance.now();
  const before = performance.now();
  try {
    return await import("./server.impl.js");
  } finally {
    const now = performance.now();
    emitStartupTrace("gateway.server-impl-import", now - before, now - startupStartedAt);
  }
}

/** Reused helper for start Gateway Server behavior in src/gateway. */
export async function startGatewayServer(
  ...args: Parameters<typeof import("./server.impl.js").startGatewayServer>
): ReturnType<typeof import("./server.impl.js").startGatewayServer> {
  const mod = await loadServerImpl();
  return await mod.startGatewayServer(...args);
}

/** Reused helper for reset Model Catalog Cache For Test behavior in src/gateway. */
export async function resetModelCatalogCacheForTest(): Promise<void> {
  const mod = await loadServerImpl();
  await mod.resetModelCatalogCacheForTest();
}
