// config zod schema sensitive helpers and runtime behavior.
import { z } from "zod";

// Everything registered here will be redacted when the config is exposed,
// e.g. sent to the dashboard
/** Reused constant for sensitive behavior in src/config. */
export const sensitive = z.registry<undefined, z.ZodType>();
