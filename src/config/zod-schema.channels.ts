// config zod schema channels helpers and runtime behavior.
import { z } from "zod";

/** Reused constant for Channel Heartbeat Visibility Schema behavior in src/config. */
export const ChannelHeartbeatVisibilitySchema = z
  .object({
    showOk: z.boolean().optional(),
    showAlerts: z.boolean().optional(),
    useIndicator: z.boolean().optional(),
  })
  .strict()
  .optional();

/** Reused constant for Channel Health Monitor Schema behavior in src/config. */
export const ChannelHealthMonitorSchema = z
  .object({
    enabled: z.boolean().optional(),
  })
  .strict()
  .optional();
