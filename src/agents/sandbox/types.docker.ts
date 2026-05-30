/** Docker-specific sandbox config contract with required defaults. */
import type { SandboxDockerSettings } from "../../config/types.sandbox.js";

type RequiredDockerConfigKeys =
  | "image"
  | "containerPrefix"
  | "workdir"
  | "readOnlyRoot"
  | "tmpfs"
  | "network"
  | "capDrop";

/** Docker sandbox config after applying required defaults. */
export type SandboxDockerConfig = Omit<SandboxDockerSettings, RequiredDockerConfigKeys> &
  Required<Pick<SandboxDockerSettings, RequiredDockerConfigKeys>>;
