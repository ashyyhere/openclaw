// QA Lab Docker runtime exports shared Docker health/check helpers for QA commands.
import {
  createQaDockerRuntime,
  type QaDockerFetchLike as FetchLike,
  type QaDockerRunCommand as RunCommand,
} from "openclaw/plugin-sdk/qa-runtime";

/** Dependency types accepted by the shared QA Docker runtime. */
export type { FetchLike, RunCommand };

const dockerRuntime = createQaDockerRuntime({
  auditContext: "qa-lab-docker-health-check",
  commandTimeoutMs: null,
});

/** Shared Docker command, port, URL, and health-check helpers. */
export const {
  execCommand,
  fetchHealthUrl,
  resolveComposeServiceUrl,
  resolveHostPort,
  waitForDockerServiceHealth,
  waitForHealth,
} = dockerRuntime;
