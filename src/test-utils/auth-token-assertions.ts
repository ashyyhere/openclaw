// test-utils auth token assertions helpers and runtime behavior.
import { expect } from "vitest";
import type { OpenClawConfig } from "../config/types.openclaw.js";

/** Reused helper for expect Generated Token Persisted To Gateway Auth behavior in src/test-utils. */
export function expectGeneratedTokenPersistedToGatewayAuth(params: {
  generatedToken?: string;
  authToken?: string;
  persistedConfig?: OpenClawConfig;
}) {
  expect(params.generatedToken).toMatch(/^[0-9a-f]{48}$/);
  expect(params.authToken).toBe(params.generatedToken);
  expect(params.persistedConfig?.gateway?.auth?.mode).toBe("token");
  expect(params.persistedConfig?.gateway?.auth?.token).toBe(params.generatedToken);
}
