// Cross-platform gateway service argument, state, and render contracts.
import type { GatewayServiceRuntime } from "./service-runtime.js";

/** Environment map accepted by gateway service managers. */
export type GatewayServiceEnv = Record<string, string | undefined>;

/** Inputs required to install or stage a managed gateway service. */
export type GatewayServiceInstallArgs = {
  env: GatewayServiceEnv;
  stdout: NodeJS.WritableStream;
  programArguments: string[];
  workingDirectory?: string;
  environment?: GatewayServiceEnv;
  environmentValueSources?: Record<string, GatewayServiceEnvironmentValueSource | undefined>;
  description?: string;
};

/** Alias for staging a service definition before installation. */
export type GatewayServiceStageArgs = GatewayServiceInstallArgs;

/** Common arguments for gateway service management commands. */
export type GatewayServiceManageArgs = {
  env: GatewayServiceEnv;
  stdout: NodeJS.WritableStream;
};

/** Inputs for service enable/disable/start/stop control operations. */
export type GatewayServiceControlArgs = {
  stdout: NodeJS.WritableStream;
  env?: GatewayServiceEnv;
  disable?: boolean;
};

/** Result of restarting immediately or scheduling a restart through the service manager. */
export type GatewayServiceRestartResult = { outcome: "completed" } | { outcome: "scheduled" };

/** Optional environment carrier for service helper calls. */
export type GatewayServiceEnvArgs = {
  env?: GatewayServiceEnv;
};

/** Source classification for environment values rendered into service definitions. */
export type GatewayServiceEnvironmentValueSource = "inline" | "file" | "inline-and-file";

/** Command, working directory, environment, and source path read from a service definition. */
export type GatewayServiceCommandConfig = {
  programArguments: string[];
  workingDirectory?: string;
  environment?: Record<string, string>;
  environmentValueSources?: Record<string, GatewayServiceEnvironmentValueSource>;
  sourcePath?: string;
};

/** Installed/loaded/running state plus resolved command and runtime status. */
export type GatewayServiceState = {
  installed: boolean;
  loaded: boolean;
  running: boolean;
  env: GatewayServiceEnv;
  command: GatewayServiceCommandConfig | null;
  runtime?: GatewayServiceRuntime;
};

/** Repair issue that prevents starting a managed gateway service safely. */
export type GatewayServiceStartRepairIssue = {
  code: "missing-program" | "temporary-program" | "version-mismatch";
  message: string;
};

/** Result of attempting to start or repair-start a managed gateway service. */
export type GatewayServiceStartResult =
  | { outcome: "started"; state: GatewayServiceState }
  | { outcome: "scheduled"; state: GatewayServiceState }
  | { outcome: "missing-install"; state: GatewayServiceState }
  | {
      outcome: "repair-required";
      state: GatewayServiceState;
      issues: GatewayServiceStartRepairIssue[];
    };

/** Inputs used to render a platform-specific gateway service definition. */
export type GatewayServiceRenderArgs = {
  description?: string;
  programArguments: string[];
  workingDirectory?: string;
  environment?: GatewayServiceEnv;
  environmentFiles?: string[];
};
