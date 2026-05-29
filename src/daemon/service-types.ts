// daemon service types helpers and runtime behavior.
import type { GatewayServiceRuntime } from "./service-runtime.js";

/** Shared type for Gateway Service Env in src/daemon. */
export type GatewayServiceEnv = Record<string, string | undefined>;

/** Shared type for Gateway Service Install Args in src/daemon. */
export type GatewayServiceInstallArgs = {
  env: GatewayServiceEnv;
  stdout: NodeJS.WritableStream;
  programArguments: string[];
  workingDirectory?: string;
  environment?: GatewayServiceEnv;
  environmentValueSources?: Record<string, GatewayServiceEnvironmentValueSource | undefined>;
  description?: string;
};

/** Shared type for Gateway Service Stage Args in src/daemon. */
export type GatewayServiceStageArgs = GatewayServiceInstallArgs;

/** Shared type for Gateway Service Manage Args in src/daemon. */
export type GatewayServiceManageArgs = {
  env: GatewayServiceEnv;
  stdout: NodeJS.WritableStream;
};

/** Shared type for Gateway Service Control Args in src/daemon. */
export type GatewayServiceControlArgs = {
  stdout: NodeJS.WritableStream;
  env?: GatewayServiceEnv;
  disable?: boolean;
};

/** Shared type for Gateway Service Restart Result in src/daemon. */
export type GatewayServiceRestartResult = { outcome: "completed" } | { outcome: "scheduled" };

/** Shared type for Gateway Service Env Args in src/daemon. */
export type GatewayServiceEnvArgs = {
  env?: GatewayServiceEnv;
};

/** Shared type for Gateway Service Environment Value Source in src/daemon. */
export type GatewayServiceEnvironmentValueSource = "inline" | "file" | "inline-and-file";

/** Shared type for Gateway Service Command Config in src/daemon. */
export type GatewayServiceCommandConfig = {
  programArguments: string[];
  workingDirectory?: string;
  environment?: Record<string, string>;
  environmentValueSources?: Record<string, GatewayServiceEnvironmentValueSource>;
  sourcePath?: string;
};

/** Shared type for Gateway Service State in src/daemon. */
export type GatewayServiceState = {
  installed: boolean;
  loaded: boolean;
  running: boolean;
  env: GatewayServiceEnv;
  command: GatewayServiceCommandConfig | null;
  runtime?: GatewayServiceRuntime;
};

/** Shared type for Gateway Service Start Repair Issue in src/daemon. */
export type GatewayServiceStartRepairIssue = {
  code: "missing-program" | "temporary-program" | "version-mismatch";
  message: string;
};

/** Shared type for Gateway Service Start Result in src/daemon. */
export type GatewayServiceStartResult =
  | { outcome: "started"; state: GatewayServiceState }
  | { outcome: "scheduled"; state: GatewayServiceState }
  | { outcome: "missing-install"; state: GatewayServiceState }
  | {
      outcome: "repair-required";
      state: GatewayServiceState;
      issues: GatewayServiceStartRepairIssue[];
    };

/** Shared type for Gateway Service Render Args in src/daemon. */
export type GatewayServiceRenderArgs = {
  description?: string;
  programArguments: string[];
  workingDirectory?: string;
  environment?: GatewayServiceEnv;
  environmentFiles?: string[];
};
