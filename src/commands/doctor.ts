/** Public doctor command entrypoint. */
import type { RuntimeEnv } from "../runtime.js";
import type { DoctorOptions } from "./doctor-prompter.js";

/** Reused helper for doctor Command behavior in src/commands. */
export async function doctorCommand(runtime?: RuntimeEnv, options?: DoctorOptions): Promise<void> {
  const doctorHealth = await import("../flows/doctor-health.js");
  await doctorHealth.doctorCommand(runtime, options);
}
