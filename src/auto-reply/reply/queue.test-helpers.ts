// Shared helpers for reply queue tests.
import { afterAll, beforeAll } from "vitest";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { defaultRuntime } from "../../runtime.js";
import type { FollowupRun } from "./queue.js";

/** Reused helper for create Deferred behavior in src/auto-reply/reply. */
export function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

/** Reused helper for create Queue Test Run behavior in src/auto-reply/reply. */
export function createQueueTestRun(params: {
  prompt: string;
  messageId?: string;
  originatingChannel?: FollowupRun["originatingChannel"];
  originatingTo?: string;
  originatingAccountId?: string;
  originatingThreadId?: string | number;
  currentInboundEventKind?: FollowupRun["currentInboundEventKind"];
}): FollowupRun {
  return {
    prompt: params.prompt,
    messageId: params.messageId,
    enqueuedAt: Date.now(),
    originatingChannel: params.originatingChannel,
    originatingTo: params.originatingTo,
    originatingAccountId: params.originatingAccountId,
    originatingThreadId: params.originatingThreadId,
    currentInboundEventKind: params.currentInboundEventKind,
    run: {
      agentId: "agent",
      agentDir: "/tmp",
      sessionId: "sess",
      sessionFile: "/tmp/session.json",
      workspaceDir: "/tmp",
      config: {} as OpenClawConfig,
      provider: "openai",
      model: "gpt-test",
      timeoutMs: 10_000,
      blockReplyBreak: "text_end",
    },
  };
}

/** Reused helper for install Queue Runtime Error Silencer behavior in src/auto-reply/reply. */
export function installQueueRuntimeErrorSilencer(): void {
  let previousRuntimeError: typeof defaultRuntime.error;

  beforeAll(() => {
    previousRuntimeError = defaultRuntime.error;
    defaultRuntime.error = (() => {}) as typeof defaultRuntime.error;
  });

  afterAll(() => {
    defaultRuntime.error = previousRuntimeError;
  });
}
