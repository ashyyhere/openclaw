// Telegram RTT harness helpers run npm package round-trip timing scenarios.
import { execFile, spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

/** Provider mode used by Telegram RTT validation. */
export type RttProviderMode = "mock-openai" | "live-frontier";
/** Credential source used by Telegram RTT validation. */
export type RttCredentialSource = "env" | "convex";
/** Credential role used when leasing Telegram RTT credentials. */
export type RttCredentialRole = "maintainer" | "ci";

type RttResult = {
  package: {
    spec: string;
    version: string;
  };
  run: {
    id: string;
    startedAt: string;
    finishedAt: string;
    durationMs: number;
    status: "pass" | "fail";
  };
  mode: {
    providerMode: RttProviderMode;
    scenarios: string[];
  };
  rtt: {
    canaryMs?: number;
    mentionReplyMs?: number;
    warmSamples?: number[];
    avgMs?: number;
    p50Ms?: number;
    p95Ms?: number;
    maxMs?: number;
    failedSamples?: number;
  };
  artifacts: {
    rawSummaryPath: string;
    rawReportPath: string;
    rawObservedMessagesPath: string;
    resultPath: string;
  };
};

type TelegramQaSummary = {
  scenarios?: Array<{
    id?: string;
    rttMs?: number;
    status?: string;
    samples?: Array<{
      index?: number;
      status?: string;
      rttMs?: number;
    }>;
    stats?: {
      total?: number;
      passed?: number;
      failed?: number;
      avgMs?: number;
      p50Ms?: number;
      p95Ms?: number;
      maxMs?: number;
    };
  }>;
};

const OPENCLAW_PACKAGE_SPEC_RE =
  /^openclaw@(main|alpha|beta|latest|[0-9]{4}\.[1-9][0-9]*\.[1-9][0-9]*(-[1-9][0-9]*|-(alpha|beta)\.[1-9][0-9]*)?)$/u;

const REQUIRED_TELEGRAM_ENV = [
  "OPENCLAW_QA_TELEGRAM_GROUP_ID",
  "OPENCLAW_QA_TELEGRAM_DRIVER_BOT_TOKEN",
  "OPENCLAW_QA_TELEGRAM_SUT_BOT_TOKEN",
] as const;

/** Parses the RTT credential source option. */
export function parseRttCredentialSource(value: string): RttCredentialSource {
  const normalized = value.trim().toLowerCase();
  if (normalized === "env" || normalized === "convex") {
    return normalized;
  }
  throw new Error(`--credential-source must be env or convex; got: ${value}`);
}

/** Parses the RTT credential role option. */
export function parseRttCredentialRole(value: string): RttCredentialRole {
  const normalized = value.trim().toLowerCase();
  if (normalized === "maintainer" || normalized === "ci") {
    return normalized;
  }
  throw new Error(`--credential-role must be maintainer or ci; got: ${value}`);
}

function resolveRttCredentialSource(
  env: NodeJS.ProcessEnv,
  credentialSource?: RttCredentialSource,
): RttCredentialSource {
  if (credentialSource) {
    return credentialSource;
  }
  const rawSource =
    env.OPENCLAW_NPM_TELEGRAM_CREDENTIAL_SOURCE ?? env.OPENCLAW_QA_CREDENTIAL_SOURCE;
  if (rawSource?.trim()) {
    return parseRttCredentialSource(rawSource);
  }
  if (
    env.CI &&
    env.OPENCLAW_QA_CONVEX_SITE_URL?.trim() &&
    (env.OPENCLAW_QA_CONVEX_SECRET_CI?.trim() || env.OPENCLAW_QA_CONVEX_SECRET_MAINTAINER?.trim())
  ) {
    return "convex";
  }
  return "env";
}

function resolveRttCredentialRole(
  env: NodeJS.ProcessEnv,
  credentialRole?: RttCredentialRole,
): RttCredentialRole {
  if (credentialRole) {
    return credentialRole;
  }
  const rawRole = env.OPENCLAW_NPM_TELEGRAM_CREDENTIAL_ROLE ?? env.OPENCLAW_QA_CREDENTIAL_ROLE;
  if (rawRole?.trim()) {
    return parseRttCredentialRole(rawRole);
  }
  return env.CI ? "ci" : "maintainer";
}

/** Validates OpenClaw npm package specs accepted by RTT runs. */
export function validateOpenClawPackageSpec(spec: string) {
  if (!OPENCLAW_PACKAGE_SPEC_RE.test(spec)) {
    throw new Error(
      `Package spec must be openclaw@main, openclaw@alpha, openclaw@beta, openclaw@latest, or an exact OpenClaw release version; got: ${spec}`,
    );
  }
  return spec;
}

/** Converts package specs into filesystem-safe RTT run labels. */
export function safeRunLabel(input: string) {
  return input.replace(/[^a-zA-Z0-9.-]+/gu, "_").replace(/^_+|_+$/gu, "");
}

/** Builds a timestamped RTT run id. */
export function buildRunId(params: { now: Date; spec: string; index?: number }) {
  const stamp = params.now.toISOString().replaceAll(":", "").replaceAll(".", "");
  const suffix = params.index === undefined ? "" : `-${params.index + 1}`;
  return `${stamp}-${safeRunLabel(params.spec)}${suffix}`;
}

/** Extracts RTT metrics from a Telegram QA summary. */
export function extractRtt(summary: TelegramQaSummary) {
  const scenarios = summary.scenarios ?? [];
  const mention = scenarios.find((scenario) => scenario.id === "telegram-mentioned-message-reply");
  const warmSamples = mention?.samples
    ?.filter((sample) => sample.status === "pass" && sample.rttMs !== undefined)
    .toSorted((left, right) => (left.index ?? 0) - (right.index ?? 0))
    .flatMap((sample) => (sample.rttMs === undefined ? [] : [sample.rttMs]));
  const rtt: RttResult["rtt"] = {
    canaryMs: scenarios.find((scenario) => scenario.id === "telegram-canary")?.rttMs,
    mentionReplyMs: mention?.stats?.p50Ms ?? mention?.rttMs,
  };
  if (warmSamples?.length) {
    rtt.warmSamples = warmSamples;
  }
  if (mention?.stats) {
    rtt.avgMs = mention.stats.avgMs;
    rtt.p50Ms = mention.stats.p50Ms;
    rtt.p95Ms = mention.stats.p95Ms;
    rtt.maxMs = mention.stats.maxMs;
    rtt.failedSamples = mention.stats.failed;
  }
  return rtt;
}

/** Builds the environment passed to the Telegram RTT Docker harness. */
export function createHarnessEnv(params: {
  baseEnv: NodeJS.ProcessEnv;
  credentialRole?: RttCredentialRole;
  credentialSource?: RttCredentialSource;
  packageTgz?: string;
  providerMode: RttProviderMode;
  scenarios: string[];
  spec: string;
  version: string;
  rawOutputDir: string;
  samples: number;
  sampleTimeoutMs: number;
  timeoutMs: number;
}) {
  return {
    ...params.baseEnv,
    OPENCLAW_NPM_TELEGRAM_PACKAGE_SPEC: params.spec,
    ...(params.packageTgz ? { OPENCLAW_NPM_TELEGRAM_PACKAGE_TGZ: params.packageTgz } : {}),
    OPENCLAW_NPM_TELEGRAM_PACKAGE_LABEL: `${params.spec} (${params.version})`,
    OPENCLAW_NPM_TELEGRAM_PROVIDER_MODE: params.providerMode,
    ...(params.credentialSource
      ? { OPENCLAW_NPM_TELEGRAM_CREDENTIAL_SOURCE: params.credentialSource }
      : {}),
    ...(params.credentialRole
      ? { OPENCLAW_NPM_TELEGRAM_CREDENTIAL_ROLE: params.credentialRole }
      : {}),
    OPENCLAW_NPM_TELEGRAM_SCENARIOS: params.scenarios.join(","),
    OPENCLAW_NPM_TELEGRAM_OUTPUT_DIR: params.rawOutputDir,
    OPENCLAW_NPM_TELEGRAM_FAST: params.baseEnv.OPENCLAW_NPM_TELEGRAM_FAST ?? "1",
    OPENCLAW_NPM_TELEGRAM_WARM_SAMPLES: String(params.samples),
    OPENCLAW_NPM_TELEGRAM_SAMPLE_TIMEOUT_MS: String(params.sampleTimeoutMs),
    OPENCLAW_QA_TELEGRAM_CANARY_TIMEOUT_MS: String(params.timeoutMs),
    OPENCLAW_QA_TELEGRAM_SCENARIO_TIMEOUT_MS: String(params.timeoutMs),
  };
}

/** Ensures required Telegram or Convex credential environment is present. */
export function assertRequiredEnv(
  env: NodeJS.ProcessEnv,
  options: {
    credentialRole?: RttCredentialRole;
    credentialSource?: RttCredentialSource;
  } = {},
) {
  const credentialSource = resolveRttCredentialSource(env, options.credentialSource);
  if (credentialSource === "convex") {
    const missing: string[] = [];
    const credentialRole = resolveRttCredentialRole(env, options.credentialRole);
    if (!env.OPENCLAW_QA_CONVEX_SITE_URL?.trim()) {
      missing.push("OPENCLAW_QA_CONVEX_SITE_URL");
    }
    if (credentialRole === "ci" && !env.OPENCLAW_QA_CONVEX_SECRET_CI?.trim()) {
      missing.push("OPENCLAW_QA_CONVEX_SECRET_CI");
    }
    if (credentialRole === "maintainer" && !env.OPENCLAW_QA_CONVEX_SECRET_MAINTAINER?.trim()) {
      missing.push("OPENCLAW_QA_CONVEX_SECRET_MAINTAINER");
    }
    if (missing.length > 0) {
      throw new Error(`Missing Convex Telegram QA credential env: ${missing.join(", ")}`);
    }
    return;
  }

  const missing = REQUIRED_TELEGRAM_ENV.filter((key) => !env[key]?.trim());
  if (missing.length > 0) {
    throw new Error(`Missing Telegram QA env: ${missing.join(", ")}`);
  }
}

/** Verifies the RTT harness script exists in the target checkout. */
export async function assertHarnessRoot(harnessRoot: string) {
  const scriptPath = path.join(harnessRoot, "scripts/e2e/npm-telegram-rtt-docker.sh");
  try {
    await fs.access(scriptPath);
  } catch {
    throw new Error(`Missing OpenClaw Telegram npm harness: ${scriptPath}`);
  }
}

/** Verifies Docker is available before running RTT scenarios. */
export async function assertDockerAvailable() {
  try {
    await execFileAsync("docker", ["version", "--format", "{{.Server.Version}}"], {
      timeout: 10_000,
    });
  } catch {
    throw new Error("Docker is required for RTT runs; install/start Docker and retry.");
  }
}

/** Resolves a published OpenClaw package spec to its npm version. */
export async function resolvePublishedVersion(spec: string) {
  const { stdout } = await execFileAsync("npm", ["view", spec, "version", "--json"], {
    timeout: 30_000,
  });
  const parsed = JSON.parse(stdout.trim()) as unknown;
  if (typeof parsed !== "string" || parsed.trim().length === 0) {
    throw new Error(`npm did not return a version for ${spec}.`);
  }
  return parsed.trim();
}

/** Resolves the current checkout version plus short git SHA for `openclaw@main`. */
export async function resolveMainVersion(harnessRoot: string) {
  const packageJson = JSON.parse(
    await fs.readFile(path.join(harnessRoot, "package.json"), "utf8"),
  ) as { version?: unknown };
  if (typeof packageJson.version !== "string" || packageJson.version.trim().length === 0) {
    throw new Error("OpenClaw package.json must contain a non-empty version.");
  }
  const { stdout } = await execFileAsync("git", ["rev-parse", "--short=10", "HEAD"], {
    cwd: harnessRoot,
    timeout: 10_000,
  });
  return `${packageJson.version.trim()}+${stdout.trim()}`;
}

/** Reads the raw Telegram QA summary emitted by the RTT harness. */
export async function readTelegramSummary(summaryPath: string) {
  return JSON.parse(await fs.readFile(summaryPath, "utf8")) as TelegramQaSummary;
}

/** Writes pretty JSON, creating parent directories as needed. */
export async function writeJson(pathname: string, value: unknown) {
  await fs.mkdir(path.dirname(pathname), { recursive: true });
  await fs.writeFile(pathname, `${JSON.stringify(value, null, 2)}\n`);
}

/** Appends one JSONL record, creating parent directories as needed. */
export async function appendJsonl(pathname: string, value: unknown) {
  await fs.mkdir(path.dirname(pathname), { recursive: true });
  await fs.appendFile(pathname, `${JSON.stringify(value)}\n`);
}

/** Runs the Telegram RTT Docker harness script. */
export async function runHarness(params: { env: NodeJS.ProcessEnv; harnessRoot: string }) {
  const scriptPath = path.join(params.harnessRoot, "scripts/e2e/npm-telegram-rtt-docker.sh");
  const child = spawn("bash", [scriptPath], {
    cwd: params.harnessRoot,
    env: params.env,
    stdio: "inherit",
  });
  const exitCode = await new Promise<number | null>((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", resolve);
  });
  return exitCode ?? 1;
}

/** Builds the normalized RTT result artifact from raw harness output. */
export function buildRttResult(params: {
  artifacts: RttResult["artifacts"];
  finishedAt: Date;
  providerMode: RttProviderMode;
  rawSummary: TelegramQaSummary;
  runId: string;
  scenarios: string[];
  spec: string;
  startedAt: Date;
  version: string;
}): RttResult {
  const failed = (params.rawSummary.scenarios ?? []).some((scenario) => scenario.status === "fail");
  return {
    package: {
      spec: params.spec,
      version: params.version,
    },
    run: {
      id: params.runId,
      startedAt: params.startedAt.toISOString(),
      finishedAt: params.finishedAt.toISOString(),
      durationMs: params.finishedAt.getTime() - params.startedAt.getTime(),
      status: failed ? "fail" : "pass",
    },
    mode: {
      providerMode: params.providerMode,
      scenarios: params.scenarios,
    },
    rtt: extractRtt(params.rawSummary),
    artifacts: params.artifacts,
  };
}
