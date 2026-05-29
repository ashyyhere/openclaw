// gateway test helpers runtime state helpers and runtime behavior.
import crypto from "node:crypto";
import os from "node:os";
import path from "node:path";
import { vi } from "vitest";
import type { Mock } from "vitest";
import type { GetReplyOptions } from "../auto-reply/get-reply-options.types.js";
import type { ReplyPayload } from "../auto-reply/reply-payload.js";
import type { MsgContext } from "../auto-reply/templating.js";
import type { AgentBinding } from "../config/types.agents.js";
import type { HooksConfig } from "../config/types.hooks.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { RunCronAgentTurnResult } from "../cron/isolated-agent/run.types.js";
import type { TailscaleWhoisIdentity } from "../infra/tailscale.js";
import { resolveGlobalSingleton } from "../shared/global-singleton.js";

/** Shared type for Get Reply From Config Fn in src/gateway. */
export type GetReplyFromConfigFn = (
  ctx: MsgContext,
  opts?: GetReplyOptions,
  configOverride?: OpenClawConfig,
) => Promise<ReplyPayload | ReplyPayload[] | undefined>;
type CronIsolatedRunFn = (...args: unknown[]) => Promise<RunCronAgentTurnResult>;
type AgentCommandFn = (...args: unknown[]) => Promise<void>;
type SendWhatsAppFn = (...args: unknown[]) => Promise<{ messageId: string; toJid: string }>;
/** Shared type for Run Btw Side Question Fn in src/gateway. */
export type RunBtwSideQuestionFn = (...args: unknown[]) => Promise<unknown>;
type DispatchInboundMessageFn = (...args: unknown[]) => Promise<unknown>;
type CompactEmbeddedAgentSessionFn = (...args: unknown[]) => Promise<unknown>;

const GATEWAY_TEST_CONFIG_ROOT_KEY = Symbol.for("openclaw.gatewayTestHelpers.configRoot");

type GatewayTestHoistedState = {
  testTailnetIPv4: { value: string | undefined };
  agentDiscoveryMock: {
    enabled: boolean;
    discoverCalls: number;
    models: Array<{
      id: string;
      name?: string;
      provider: string;
      contextWindow?: number;
      reasoning?: boolean;
      input?: string[];
    }>;
  };
  cronIsolatedRun: Mock<CronIsolatedRunFn>;
  agentCommand: Mock<AgentCommandFn>;
  runBtwSideQuestion: Mock<RunBtwSideQuestionFn>;
  dispatchInboundMessage: Mock<DispatchInboundMessageFn>;
  testIsNixMode: { value: boolean };
  sessionStoreSaveDelayMs: { value: number };
  embeddedRunMock: {
    activeIds: Set<string>;
    abortCalls: string[];
    waitCalls: string[];
    waitResults: Map<string, boolean>;
    compactEmbeddedAgentSession: Mock<CompactEmbeddedAgentSessionFn>;
  };
  testTailscaleWhois: { value: TailscaleWhoisIdentity | null };
  getReplyFromConfig: Mock<GetReplyFromConfigFn>;
  sendWhatsAppMock: Mock<SendWhatsAppFn>;
  testState: {
    agentConfig: Record<string, unknown> | undefined;
    agentsConfig: Record<string, unknown> | undefined;
    bindingsConfig: AgentBinding[] | undefined;
    channelsConfig: Record<string, unknown> | undefined;
    sessionStorePath: string | undefined;
    sessionConfig: Record<string, unknown> | undefined;
    allowFrom: string[] | undefined;
    cronStorePath: string | undefined;
    cronEnabled: boolean | undefined;
    gatewayBind: "auto" | "lan" | "tailnet" | "loopback" | undefined;
    gatewayAuth: Record<string, unknown> | undefined;
    gatewayControlUi: Record<string, unknown> | undefined;
    hooksConfig: HooksConfig | undefined;
    legacyIssues: Array<{ path: string; message: string }>;
    legacyParsed: Record<string, unknown>;
    migrationConfig: Record<string, unknown> | null;
    migrationChanges: string[];
  };
};

const gatewayTestHoisted = vi.hoisted(() => {
  const key = Symbol.for("openclaw.gatewayTestHelpers.hoisted");
  const store = globalThis as Record<PropertyKey, unknown>;
  if (Object.prototype.hasOwnProperty.call(store, key)) {
    return store[key] as GatewayTestHoistedState;
  }
  const created: GatewayTestHoistedState = {
    testTailnetIPv4: { value: undefined },
    agentDiscoveryMock: {
      enabled: false,
      discoverCalls: 0,
      models: [],
    },
    cronIsolatedRun: vi.fn(async () => ({ status: "ok", summary: "ok" })),
    agentCommand: vi.fn().mockResolvedValue(undefined),
    runBtwSideQuestion: vi.fn().mockResolvedValue(undefined),
    dispatchInboundMessage: vi.fn(),
    testIsNixMode: { value: false },
    sessionStoreSaveDelayMs: { value: 0 },
    embeddedRunMock: {
      activeIds: new Set<string>(),
      abortCalls: [],
      waitCalls: [],
      waitResults: new Map<string, boolean>(),
      compactEmbeddedAgentSession: vi.fn().mockResolvedValue({
        ok: true,
        compacted: true,
        result: {
          summary: "summary",
          firstKeptEntryId: "entry-1",
          tokensBefore: 120,
          tokensAfter: 80,
        },
      }),
    },
    testTailscaleWhois: { value: null },
    getReplyFromConfig: vi.fn<GetReplyFromConfigFn>().mockResolvedValue(undefined),
    sendWhatsAppMock: vi.fn().mockResolvedValue({ messageId: "msg-1", toJid: "jid-1" }),
    testState: {
      agentConfig: undefined,
      agentsConfig: undefined,
      bindingsConfig: undefined,
      channelsConfig: undefined,
      sessionStorePath: undefined,
      sessionConfig: undefined,
      allowFrom: undefined,
      cronStorePath: undefined,
      cronEnabled: false,
      gatewayBind: undefined,
      gatewayAuth: undefined,
      gatewayControlUi: undefined,
      hooksConfig: undefined,
      legacyIssues: [],
      legacyParsed: {},
      migrationConfig: null,
      migrationChanges: [],
    },
  };
  store[key] = created;
  return created;
});

/** Reused helper for get Gateway Test Hoisted State behavior in src/gateway. */
export function getGatewayTestHoistedState(): GatewayTestHoistedState {
  return gatewayTestHoisted;
}

/** Reused constant for test Tailnet IPv4 behavior in src/gateway. */
export const testTailnetIPv4 = gatewayTestHoisted.testTailnetIPv4;
/** Reused constant for test Tailscale Whois behavior in src/gateway. */
export const testTailscaleWhois = gatewayTestHoisted.testTailscaleWhois;
/** Reused constant for agent Discovery Mock behavior in src/gateway. */
export const agentDiscoveryMock = gatewayTestHoisted.agentDiscoveryMock;
/** Reused constant for cron Isolated Run behavior in src/gateway. */
export const cronIsolatedRun = gatewayTestHoisted.cronIsolatedRun;
/** Reused constant for agent Command behavior in src/gateway. */
export const agentCommand = gatewayTestHoisted.agentCommand;
/** Reused constant for run Btw Side Question behavior in src/gateway. */
export const runBtwSideQuestion = gatewayTestHoisted.runBtwSideQuestion;
/** Reused constant for dispatch Inbound Message Mock behavior in src/gateway. */
export const dispatchInboundMessageMock = gatewayTestHoisted.dispatchInboundMessage;
/** Reused constant for get Reply From Config behavior in src/gateway. */
export const getReplyFromConfig = gatewayTestHoisted.getReplyFromConfig;
/** Reused constant for mock Get Reply From Config Once behavior in src/gateway. */
export const mockGetReplyFromConfigOnce = (impl: GetReplyFromConfigFn) => {
  getReplyFromConfig.mockImplementationOnce(impl);
};
/** Reused constant for send Whats App Mock behavior in src/gateway. */
export const sendWhatsAppMock = gatewayTestHoisted.sendWhatsAppMock;
/** Reused constant for test State behavior in src/gateway. */
export const testState = gatewayTestHoisted.testState;
/** Reused constant for test Is Nix Mode behavior in src/gateway. */
export const testIsNixMode = gatewayTestHoisted.testIsNixMode;
/** Reused constant for session Store Save Delay Ms behavior in src/gateway. */
export const sessionStoreSaveDelayMs = gatewayTestHoisted.sessionStoreSaveDelayMs;
/** Reused constant for embedded Run Mock behavior in src/gateway. */
export const embeddedRunMock = gatewayTestHoisted.embeddedRunMock;

/** Reused constant for test Config Root behavior in src/gateway. */
export const testConfigRoot = resolveGlobalSingleton(GATEWAY_TEST_CONFIG_ROOT_KEY, () => ({
  value: path.join(os.tmpdir(), `openclaw-gateway-test-${process.pid}-${crypto.randomUUID()}`),
}));

/** Reused helper for set Test Config Root behavior in src/gateway. */
export function setTestConfigRoot(root: string): void {
  testConfigRoot.value = root;
  process.env.OPENCLAW_CONFIG_PATH = path.join(root, "openclaw.json");
}
