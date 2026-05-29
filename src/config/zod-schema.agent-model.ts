// config zod schema agent model helpers and runtime behavior.
import { z } from "zod";

/** Reused constant for Agent Model Schema behavior in src/config. */
export const AgentModelSchema = z.union([
  z.string(),
  z
    .object({
      primary: z.string().optional(),
      fallbacks: z.array(z.string()).optional(),
    })
    .strict(),
]);

/** Reused constant for Agent Tool Model Schema behavior in src/config. */
export const AgentToolModelSchema = z.union([
  z.string(),
  z
    .object({
      primary: z.string().optional(),
      fallbacks: z.array(z.string()).optional(),
      timeoutMs: z.number().int().positive().optional(),
    })
    .strict(),
]);
