// cron isolated agent turn test helpers helpers and runtime behavior.
import "./isolated-agent.mocks.js";
import fs from "node:fs/promises";
import { expect, vi } from "vitest";
import { runEmbeddedAgent } from "../agents/embedded-agent.js";
import type { CliDeps } from "../cli/deps.js";
import { runCronIsolatedAgentTurn } from "./isolated-agent.js";
import {
  makeCfg,
  makeJob,
  withTempCronHome as withTempHome,
  writeSessionStoreEntries,
} from "./isolated-agent.test-harness.js";
import type { CronJob } from "./types.js";

/** Re-exported API for src/cron, starting with with Temp Home. */
export { withTempHome };

/** Reused helper for make Deps behavior in src/cron. */
export function makeDeps(): CliDeps {
  return {
    sendMessageSlack: vi.fn(),
    sendMessageWhatsApp: vi.fn(),
    sendMessageTelegram: vi.fn(),
    sendMessageDiscord: vi.fn(),
    sendMessageSignal: vi.fn(),
    sendMessageIMessage: vi.fn(),
  };
}

function mockEmbeddedPayloads(payloads: Array<{ text?: string; isError?: boolean }>) {
  vi.mocked(runEmbeddedAgent).mockResolvedValue({
    payloads,
    meta: {
      durationMs: 5,
      agentMeta: { sessionId: "s", provider: "p", model: "m" },
    },
  });
}

function mockEmbeddedTexts(texts: string[]) {
  mockEmbeddedPayloads(texts.map((text) => ({ text })));
}

/** Reused helper for mock Embedded Ok behavior in src/cron. */
export function mockEmbeddedOk() {
  mockEmbeddedTexts(["ok"]);
}

/** Reused helper for expect Embedded Provider Model behavior in src/cron. */
export function expectEmbeddedProviderModel(expected: { provider: string; model: string }) {
  const call = vi.mocked(runEmbeddedAgent).mock.calls.at(-1)?.[0] as {
    provider?: string;
    model?: string;
  };
  return {
    provider: call?.provider,
    model: call?.model,
    assert() {
      expect(call?.provider).toBe(expected.provider);
      expect(call?.model).toBe(expected.model);
    },
  };
}

/** Reused helper for read Session Entry behavior in src/cron. */
export async function readSessionEntry(storePath: string, key: string) {
  const raw = await fs.readFile(storePath, "utf-8");
  const store = JSON.parse(raw) as Record<
    string,
    { sessionId?: string; label?: string; sessionFile?: string }
  >;
  return store[key];
}

/** Reused constant for DEFAULT MESSAGE behavior in src/cron. */
export const DEFAULT_MESSAGE = "do it";
const DEFAULT_SESSION_KEY = "cron:job-1";
/** Reused constant for DEFAULT AGENT TURN PAYLOAD behavior in src/cron. */
export const DEFAULT_AGENT_TURN_PAYLOAD: CronJob["payload"] = {
  kind: "agentTurn",
  message: DEFAULT_MESSAGE,
};
/** Reused constant for GMAIL MODEL behavior in src/cron. */
export const GMAIL_MODEL = "openrouter/meta-llama/llama-3.3-70b:free";

type RunCronTurnOptions = {
  cfgOverrides?: Parameters<typeof makeCfg>[2];
  deps?: CliDeps;
  delivery?: CronJob["delivery"];
  jobPayload?: CronJob["payload"];
  message?: string;
  mockTexts?: string[] | null;
  sessionKey?: string;
  storeEntries?: Record<string, Record<string, unknown>>;
  storePath?: string;
};

/** Reused helper for run Cron Turn behavior in src/cron. */
export async function runCronTurn(home: string, options: RunCronTurnOptions = {}) {
  const storePath =
    options.storePath ??
    (await writeSessionStoreEntries(home, {
      "agent:main:main": {
        sessionId: "main-session",
        updatedAt: Date.now(),
        lastProvider: "webchat",
        lastTo: "",
      },
      ...options.storeEntries,
    }));
  const deps = options.deps ?? makeDeps();
  if (options.mockTexts === null) {
    vi.mocked(runEmbeddedAgent).mockClear();
  } else {
    mockEmbeddedTexts(options.mockTexts ?? ["ok"]);
  }

  const jobPayload = options.jobPayload ?? DEFAULT_AGENT_TURN_PAYLOAD;
  const res = await runCronIsolatedAgentTurn({
    cfg: makeCfg(home, storePath, options.cfgOverrides),
    deps,
    job: {
      ...makeJob(jobPayload),
      delivery: options.delivery ?? { mode: "none" },
    },
    message:
      options.message ?? (jobPayload.kind === "agentTurn" ? jobPayload.message : DEFAULT_MESSAGE),
    sessionKey: options.sessionKey ?? DEFAULT_SESSION_KEY,
    lane: "cron",
  });

  return { deps, res, storePath };
}

/** Reused helper for run Gmail Hook Turn behavior in src/cron. */
export async function runGmailHookTurn(
  home: string,
  storeEntries?: Record<string, Record<string, unknown>>,
) {
  return runCronTurn(home, {
    cfgOverrides: {
      hooks: {
        gmail: {
          model: GMAIL_MODEL,
        },
      },
    },
    jobPayload: DEFAULT_AGENT_TURN_PAYLOAD,
    sessionKey: "hook:gmail:msg-1",
    storeEntries,
  });
}

/** Reused helper for run Turn With Stored Model Override behavior in src/cron. */
export async function runTurnWithStoredModelOverride(
  home: string,
  jobPayload: CronJob["payload"],
  modelOverride = "gpt-4.1-mini",
  providerOverride = "openai",
  cfgOverrides?: Parameters<typeof makeCfg>[2],
) {
  return runCronTurn(home, {
    cfgOverrides,
    jobPayload,
    storeEntries: {
      "agent:main:cron:job-1": {
        sessionId: "existing-cron-session",
        updatedAt: Date.now(),
        providerOverride,
        modelOverride,
      },
    },
  });
}
