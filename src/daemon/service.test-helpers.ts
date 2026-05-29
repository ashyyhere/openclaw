// daemon service test helpers helpers and runtime behavior.
import { vi } from "vitest";
import type { GatewayService } from "./service.js";

/** Reused helper for create Mock Gateway Service behavior in src/daemon. */
export function createMockGatewayService(overrides: Partial<GatewayService> = {}): GatewayService {
  return {
    label: "LaunchAgent",
    loadedText: "loaded",
    notLoadedText: "not loaded",
    stage: vi.fn(async () => {}),
    install: vi.fn(async () => {}),
    uninstall: vi.fn(async () => {}),
    stop: vi.fn(async () => {}),
    restart: vi.fn(async () => ({ outcome: "completed" as const })),
    isLoaded: vi.fn(async () => false),
    readCommand: vi.fn(async () => null),
    readRuntime: vi.fn(async () => ({ status: "stopped" as const })),
    ...overrides,
  };
}
