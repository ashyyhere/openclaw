// cron/isolated-agent job fixtures helpers and runtime behavior.
type LooseRecord = Record<string, unknown>;

/** Reused helper for make Isolated Agent Job Fixture behavior in src/cron/isolated-agent. */
export function makeIsolatedAgentJobFixture(overrides?: LooseRecord) {
  return {
    id: "test-job",
    name: "Test Job",
    schedule: { kind: "cron", expr: "0 9 * * *", tz: "UTC" },
    sessionTarget: "isolated",
    payload: { kind: "agentTurn", message: "test" },
    ...overrides,
  } as never;
}

/** Reused helper for make Isolated Agent Params Fixture behavior in src/cron/isolated-agent. */
export function makeIsolatedAgentParamsFixture(overrides?: LooseRecord) {
  const jobOverrides =
    overrides && "job" in overrides ? (overrides.job as LooseRecord | undefined) : undefined;
  return {
    cfg: {},
    deps: {} as never,
    job: makeIsolatedAgentJobFixture(jobOverrides),
    message: "test",
    sessionKey: "cron:test",
    ...overrides,
  };
}
