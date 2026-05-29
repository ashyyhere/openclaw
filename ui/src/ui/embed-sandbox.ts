// Iframe sandbox policy mapping for Control UI embedded content.
import type { ControlUiEmbedSandboxMode } from "../../../src/gateway/control-ui-contract.js";

/** Sandbox mode accepted by Control UI embed frames. */
export type EmbedSandboxMode = ControlUiEmbedSandboxMode;

/** Convert an embed sandbox mode into an iframe sandbox attribute value. */
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
