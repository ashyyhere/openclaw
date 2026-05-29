// gateway server broadcast types helpers and runtime behavior.
type GatewayBroadcastStateVersion = {
  presence?: number;
  health?: number;
};

/** Shared type for Gateway Broadcast Opts in src/gateway. */
export type GatewayBroadcastOpts = {
  dropIfSlow?: boolean;
  stateVersion?: GatewayBroadcastStateVersion;
};

/** Shared type for Gateway Broadcast Fn in src/gateway. */
export type GatewayBroadcastFn = (
  event: string,
  payload: unknown,
  opts?: GatewayBroadcastOpts,
) => void;

/** Shared type for Gateway Broadcast To Conn Ids Fn in src/gateway. */
export type GatewayBroadcastToConnIdsFn = (
  event: string,
  payload: unknown,
  connIds: ReadonlySet<string>,
  opts?: GatewayBroadcastOpts,
) => void;
