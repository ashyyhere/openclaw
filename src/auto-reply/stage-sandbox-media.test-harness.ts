// Shared test harness for sandbox media staging scenarios.
import { join } from "node:path";
import { withTempHome as withTempHomeBase } from "openclaw/plugin-sdk/test-env";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { MsgContext, TemplateContext } from "./templating.js";

/** Run a sandbox media staging test with an isolated temp HOME. */
export async function withSandboxMediaTempHome<T>(
  prefix: string,
  fn: (home: string) => Promise<T>,
): Promise<T> {
  return withTempHomeBase(async (home) => await fn(home), { prefix, skipSessionCleanup: true });
}

/** Build paired message/template contexts that reference one staged media file. */
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

/** Build config for sandbox media staging with isolated workspace and session store. */
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
