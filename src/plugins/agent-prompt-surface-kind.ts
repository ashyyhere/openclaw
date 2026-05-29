// plugins agent prompt surface kind helpers and runtime behavior.
import type { AgentPromptSurfaceKind } from "./types.js";

/** Reused helper for normalize Agent Prompt Surface Kind behavior in src/plugins. */
export function normalizeAgentPromptSurfaceKind(
  surface: AgentPromptSurfaceKind,
): AgentPromptSurfaceKind {
  return surface === "pi_main" ? "openclaw_main" : surface;
}

/** Reused helper for is Open Claw Main Prompt Surface behavior in src/plugins. */
export function isOpenClawMainPromptSurface(surface: AgentPromptSurfaceKind): boolean {
  return normalizeAgentPromptSurfaceKind(surface) === "openclaw_main";
}
