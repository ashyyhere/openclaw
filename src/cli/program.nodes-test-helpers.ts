/**
 * Stable connected iOS node fixture used by CLI node tests.
 */
export const IOS_NODE = {
  nodeId: "ios-node",
  displayName: "iOS Node",
  remoteIp: "192.168.0.88",
  connected: true,
} as const;

/** Build a stable iOS node-list response for CLI tests. */
export function createIosNodeListResponse(ts: number = Date.now()) {
  return {
    ts,
    nodes: [IOS_NODE],
  };
}
