// config/sessions store maintenance runtime helpers and runtime behavior.
import { getRuntimeConfig } from "../config.js";
import type { SessionMaintenanceConfig } from "../types.base.js";
import {
  resolveMaintenanceConfigFromInput,
  type ResolvedSessionMaintenanceConfig,
} from "./store-maintenance.js";

/** Reused helper for resolve Maintenance Config behavior in src/config/sessions. */
export function resolveMaintenanceConfig(): ResolvedSessionMaintenanceConfig {
  let maintenance: SessionMaintenanceConfig | undefined;
  try {
    maintenance = getRuntimeConfig().session?.maintenance;
  } catch {
    // Config may not be available in narrow test/runtime helpers.
  }
  return resolveMaintenanceConfigFromInput(maintenance);
}
