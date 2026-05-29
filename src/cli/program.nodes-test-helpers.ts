/** Shared node response fixtures for CLI program tests. */
export const IOS_NODE = {
  nodeId: "ios-node",
  displayName: "iOS Node",
  remoteIp: "192.168.0.88",
  connected: true,
} as const;

/** Reused helper for create Ios Node List Response behavior in src/cli. */
export function createIosNodeListResponse(ts: number = Date.now()) {
  return {
    ts,
    nodes: [IOS_NODE],
  };
}
