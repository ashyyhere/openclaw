// Shared test harness for sandbox media staging scenarios.
import { join } from "node:path";
import { withTempHome as withTempHomeBase } from "openclaw/plugin-sdk/test-env";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { MsgContext, TemplateContext } from "./templating.js";

/** Reused helper for with Sandbox Media Temp Home behavior in src/auto-reply. */
export async function withSandboxMediaTempHome<T>(
  prefix: string,
  fn: (home: string) => Promise<T>,
): Promise<T> {
  return withTempHomeBase(async (home) => await fn(home), { prefix, skipSessionCleanup: true });
}

/** Reused helper for create Sandbox Media Contexts behavior in src/auto-reply. */
export function createSandboxMediaContexts(mediaPath: string): {
  ctx: MsgContext;
  sessionCtx: TemplateContext;
} {
  const ctx: MsgContext = {
    Body: "hi",
    From: "whatsapp:group:demo",
    To: "+2000",
    ChatType: "group",
    Provider: "whatsapp",
    MediaPath: mediaPath,
    MediaType: "image/jpeg",
    MediaUrl: mediaPath,
  };
  return { ctx, sessionCtx: { ...ctx } };
}

/** Reused helper for create Sandbox Media Stage Config behavior in src/auto-reply. */
export function createSandboxMediaStageConfig(home: string): OpenClawConfig {
  return {
    agents: {
      defaults: {
        model: "anthropic/claude-opus-4-6",
        workspace: join(home, "openclaw"),
        sandbox: {
          mode: "non-main",
          workspaceRoot: join(home, "sandboxes"),
        },
      },
    },
    channels: { whatsapp: { allowFrom: ["*"] } },
    session: { store: join(home, "sessions.json") },
  } as OpenClawConfig;
}
