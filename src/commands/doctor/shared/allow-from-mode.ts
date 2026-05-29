/** Resolves doctor-facing allow-from modes from channel capabilities. */
import { getDoctorChannelCapabilities } from "../channel-capabilities.js";
import type { AllowFromMode } from "./allow-from-mode.types.js";

/** Re-exported API for src/commands/doctor, starting with Allow From Mode. */
export type { AllowFromMode } from "./allow-from-mode.types.js";

/** Reused helper for resolve Allow From Mode behavior in src/commands/doctor. */
export function resolveAllowFromMode(channelName: string): AllowFromMode {
  return getDoctorChannelCapabilities(channelName).dmAllowFromMode;
}
