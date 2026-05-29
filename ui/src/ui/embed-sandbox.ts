// ui/src/ui embed sandbox helpers and runtime behavior.
import type { ControlUiEmbedSandboxMode } from "../../../src/gateway/control-ui-contract.js";

/** Shared type for Embed Sandbox Mode in ui/src/ui. */
export type EmbedSandboxMode = ControlUiEmbedSandboxMode;

/** Reused helper for resolve Embed Sandbox behavior in ui/src/ui. */
export function resolveEmbedSandbox(mode: EmbedSandboxMode | null | undefined): string {
  switch (mode) {
    case "strict":
      return "";
    case "trusted":
      return "allow-scripts allow-same-origin";
    case "scripts":
    default:
      return "allow-scripts";
  }
}
