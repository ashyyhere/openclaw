// Runtime import type contracts for command detection lazy boundaries.
import type { OpenClawConfig } from "../config/types.js";
import type { CommandNormalizeOptions } from "./commands-registry.types.js";

/** Predicate contract for recognizing control command messages. */
export type IsControlCommandMessage = (
  text?: string,
  cfg?: OpenClawConfig,
  options?: CommandNormalizeOptions,
) => boolean;

/** Predicate contract for deciding whether sender authorization should be computed. */
export type ShouldComputeCommandAuthorized = (
  text?: string,
  cfg?: OpenClawConfig,
  options?: CommandNormalizeOptions,
) => boolean;
