// Hoisted shared runtime state for gateway Vitest mocks and test fixtures.
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

/** Mock signature for gateway tests that intercept reply generation. */
export type GetReplyFromConfigFn = (
  ctx: MsgContext,
  opts?: GetReplyOptions,
  configOverride?: OpenClawConfig,
) => Promise<ReplyPayload | ReplyPayload[] | undefined>;
type CronIsolatedRunFn = (...args: unknown[]) => Promise<RunCronAgentTurnResult>;
type AgentCommandFn = (...args: unknown[]) => Promise<void>;
type SendWhatsAppFn = (...args: unknown[]) => Promise<{ messageId: string; toJid: string }>;
/** Mock signature for gateway tests that intercept BTW side-question runs. */
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

/** Returns the process-global hoisted gateway test state bucket. */
export function getGatewayTestHoistedState(): GatewayTestHoistedState {
  return gatewayTestHoisted;
}

/** Mutable tailnet IPv4 fixture used by gateway network binding tests. */
export const testTailnetIPv4 = gatewayTestHoisted.testTailnetIPv4;
/** Mutable Tailscale whois fixture for auth and binding tests. */
export const testTailscaleWhois = gatewayTestHoisted.testTailscaleWhois;
/** Shared agent discovery fixture and call counter. */
export const agentDiscoveryMock = gatewayTestHoisted.agentDiscoveryMock;
/** Mocked cron isolated-run entrypoint used by gateway RPC tests. */
export const cronIsolatedRun = gatewayTestHoisted.cronIsolatedRun;
/** Mocked agent command dispatcher used by ingress and RPC tests. */
export const agentCommand = gatewayTestHoisted.agentCommand;
/** Mocked BTW side-question runner used by gateway tests. */
export const runBtwSideQuestion = gatewayTestHoisted.runBtwSideQuestion;
/** Mocked inbound message dispatcher shared by gateway suites. */
export const dispatchInboundMessageMock = gatewayTestHoisted.dispatchInboundMessage;
/** Mocked reply generator shared by gateway server helpers. */
export const getReplyFromConfig = gatewayTestHoisted.getReplyFromConfig;
/** Installs a one-shot reply generator implementation for the next call. */
export const mockGetReplyFromConfigOnce = (impl: GetReplyFromConfigFn) => {
  getReplyFromConfig.mockImplementationOnce(impl);
};
/** Mocked WhatsApp sender returned by gateway channel tests. */
export const sendWhatsAppMock = gatewayTestHoisted.sendWhatsAppMock;
/** Mutable gateway config/session fixture consumed by test helper mocks. */
export const testState = gatewayTestHoisted.testState;
/** Mutable nix-mode fixture for platform-specific gateway tests. */
export const testIsNixMode = gatewayTestHoisted.testIsNixMode;
/** Mutable artificial session-store save delay for race-condition tests. */
export const sessionStoreSaveDelayMs = gatewayTestHoisted.sessionStoreSaveDelayMs;
/** Shared embedded-run mock state for active, abort, wait, and compact calls. */
export const embeddedRunMock = gatewayTestHoisted.embeddedRunMock;

/** Process-global config root used by gateway tests and reset helpers. */
export const testConfigRoot = resolveGlobalSingleton(GATEWAY_TEST_CONFIG_ROOT_KEY, () => ({
  value: path.join(os.tmpdir(), `openclaw-gateway-test-${process.pid}-${crypto.randomUUID()}`),
}));

/** Sets the gateway test config root and points OPENCLAW_CONFIG_PATH at it. */
export function setTestConfigRoot(root: string): void {
  testConfigRoot.value = root;
  process.env.OPENCLAW_CONFIG_PATH = path.join(root, "openclaw.json");
}
