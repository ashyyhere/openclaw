/** Session config fixtures for tests. */
import type { OpenClawConfig } from "../../config/types.openclaw.js";

/** Creates session config with per-sender defaults and overrides. */
export function createPerSenderSessionConfig(
  overrides: Partial<NonNullable<OpenClawConfig["session"]>> = {},
): NonNullable<OpenClawConfig["session"]> {
  return {
    mainKey: "main",
    scope: "per-sender",
    ...overrides,
  };
}
