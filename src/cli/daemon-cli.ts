/** Barrel for daemon and gateway service CLI command registration. */
export { registerDaemonCli } from "./daemon-cli/register.js";
/** Re-exported API for src/cli, starting with add Gateway Service Commands. */
export { addGatewayServiceCommands } from "./daemon-cli/register-service-commands.js";
/** Re-exported API for src/cli. */
export {
  runDaemonInstall,
  runDaemonRestart,
  runDaemonStart,
  runDaemonStatus,
  runDaemonStop,
  runDaemonUninstall,
} from "./daemon-cli/runners.js";
/** Re-exported API for src/cli. */
export type {
  DaemonInstallOptions,
  DaemonStatusOptions,
  GatewayRpcOpts,
} from "./daemon-cli/types.js";
