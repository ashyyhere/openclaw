// cron/isolated-agent run suite helpers helpers and runtime behavior.
import { afterEach, beforeEach } from "vitest";
import { makeIsolatedAgentJobFixture, makeIsolatedAgentParamsFixture } from "./job-fixtures.js";
import {
  clearFastTestEnv,
  makeCronSession,
  resolveCronSessionMock,
  resetRunCronIsolatedAgentTurnHarness,
  restoreFastTestEnv,
} from "./run.test-harness.js";

/** Reused helper for setup Run Cron Isolated Agent Turn Suite behavior in src/cron/isolated-agent. */
export function setupRunCronIsolatedAgentTurnSuite(options?: { fast?: boolean }) {
  let previousFastTestEnv: string | undefined;
  beforeEach(() => {
    previousFastTestEnv = clearFastTestEnv();
    if (options?.fast) {
      process.env.OPENCLAW_TEST_FAST = "1";
    }
    resetRunCronIsolatedAgentTurnHarness();
    resolveCronSessionMock.mockReturnValue(makeCronSession());
  });
  afterEach(() => {
    restoreFastTestEnv(previousFastTestEnv);
  });
}

/** Reused constant for make Isolated Agent Turn Job behavior in src/cron/isolated-agent. */
export const makeIsolatedAgentTurnJob = makeIsolatedAgentJobFixture;
/** Reused constant for make Isolated Agent Turn Params behavior in src/cron/isolated-agent. */
export const makeIsolatedAgentTurnParams = makeIsolatedAgentParamsFixture;
