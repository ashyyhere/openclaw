/** Shared fixtures and config mocks for sessions command tests. */
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { vi } from "vitest";
import type { RuntimeEnv } from "../runtime.js";

const sessionsConfigState = vi.hoisted<{ loadConfig: () => Record<string, unknown> }>(() => ({
  loadConfig: () => ({
    agents: {
      defaults: {
        model: { primary: "test:opus" },
        models: { "test:opus": {} },
        contextTokens: 32000,
      },
    },
  }),
}));

const defaultSessionsConfigLoader = sessionsConfigState.loadConfig;

vi.mock("../config/config.js", () => ({
  getRuntimeConfig: () => sessionsConfigState.loadConfig(),
  loadConfig: () => sessionsConfigState.loadConfig(),
}));

/** Reused helper for mock Sessions Config behavior in src/commands. */
export function mockSessionsConfig() {
  // The shared config mock is hoisted above so tests can keep their
  // existing setup call without paying `importActual` cost or nested-mock
  // warnings before importing `sessions.ts`.
}

/** Reused helper for set Mock Sessions Config behavior in src/commands. */
export function setMockSessionsConfig(loader: () => Record<string, unknown>) {
  sessionsConfigState.loadConfig = loader;
}

/** Reused helper for reset Mock Sessions Config behavior in src/commands. */
export function resetMockSessionsConfig() {
  sessionsConfigState.loadConfig = defaultSessionsConfigLoader;
}

/** Reused helper for make Runtime behavior in src/commands. */
export function makeRuntime(params?: { throwOnError?: boolean }): {
  runtime: RuntimeEnv;
  logs: string[];
  errors: string[];
} {
  const logs: string[] = [];
  const errors: string[] = [];
  const throwOnError = params?.throwOnError ?? false;
  return {
    runtime: {
      log: (msg: unknown) => logs.push(String(msg)),
      error: (msg: unknown) => {
        errors.push(String(msg));
        if (throwOnError) {
          throw new Error(String(msg));
        }
      },
      exit: (code: number) => {
        throw new Error(`exit ${code}`);
      },
    },
    logs,
    errors,
  };
}

/** Reused helper for write Store behavior in src/commands. */
export function writeStore(data: unknown, prefix = "sessions"): string {
  const fileName = `${[prefix, Date.now(), randomUUID()].join("-")}.json`;
  const file = path.join(os.tmpdir(), fileName);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  return file;
}

/** Reused helper for run Sessions Json behavior in src/commands. */
export async function runSessionsJson<T>(
  run: (
    opts: { json?: boolean; store?: string; active?: string; limit?: string | number },
    runtime: RuntimeEnv,
  ) => Promise<void>,
  store: string,
  options?: {
    active?: string;
    limit?: string | number;
  },
): Promise<T> {
  const { runtime, logs } = makeRuntime();
  try {
    await run(
      {
        store,
        json: true,
        active: options?.active,
        limit: options?.limit,
      },
      runtime,
    );
  } finally {
    fs.rmSync(store, { force: true });
  }
  return JSON.parse(logs[0] ?? "{}") as T;
}
