/** Public barrel for channel management command implementations. */
export type { ChannelsAddOptions } from "./channels/add.js";
/** Registers the `channels add` command implementation. */
export { channelsAddCommand } from "./channels/add.js";
/** Options accepted by the `channels capabilities` command. */
export type { ChannelsCapabilitiesOptions } from "./channels/capabilities.js";
/** Registers the `channels capabilities` command implementation. */
export { channelsCapabilitiesCommand } from "./channels/capabilities.js";
/** Options accepted by the `channels list` command. */
export type { ChannelsListOptions } from "./channels/list.js";
/** Registers the `channels list` command implementation. */
export { channelsListCommand } from "./channels/list.js";
/** Options accepted by the `channels logs` command. */
export type { ChannelsLogsOptions } from "./channels/logs.js";
/** Registers the `channels logs` command implementation. */
export { channelsLogsCommand } from "./channels/logs.js";
/** Options accepted by the `channels remove` command. */
export type { ChannelsRemoveOptions } from "./channels/remove.js";
/** Registers the `channels remove` command implementation. */
export { channelsRemoveCommand } from "./channels/remove.js";
/** Options accepted by the `channels resolve` command. */
export type { ChannelsResolveOptions } from "./channels/resolve.js";
/** Registers the `channels resolve` command implementation. */
export { channelsResolveCommand } from "./channels/resolve.js";
/** Options accepted by the `channels status` command. */
export type { ChannelsStatusOptions } from "./channels/status.js";
/** Registers and formats the `channels status` command implementation. */
export { channelsStatusCommand, formatGatewayChannelsStatusLines } from "./channels/status.js";
