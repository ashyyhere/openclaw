// config zod schema proxy helpers and runtime behavior.
import { z } from "zod";
import { sensitive } from "./zod-schema.sensitive.js";

function isHttpOrHttpsProxyUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Reused constant for Proxy Loopback Mode Schema behavior in src/config. */
export const ProxyLoopbackModeSchema = z.enum(["gateway-only", "proxy", "block"]);

const ProxyTlsConfigSchema = z
  .object({
    caFile: z.string().min(1).optional(),
  })
  .strict()
  .optional();

/** Reused constant for Proxy Config Schema behavior in src/config. */
export const ProxyConfigSchema = z
  .object({
    enabled: z.boolean().optional(),
    proxyUrl: z
      .url()
      .refine(isHttpOrHttpsProxyUrl, {
        message: "proxyUrl must use http:// or https://",
      })
      .register(sensitive)
      .optional(),
    tls: ProxyTlsConfigSchema,
    loopbackMode: ProxyLoopbackModeSchema.optional(),
  })
  .strict()
  .optional();

/** Shared type for Proxy Config in src/config. */
export type ProxyConfig = z.infer<typeof ProxyConfigSchema>;
