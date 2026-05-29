// gateway test helpers helpers and runtime behavior.
/** Re-exported API for src/gateway. */
export {
  agentCommand,
  cronIsolatedRun,
  dispatchInboundMessageMock,
  embeddedRunMock,
  getReplyFromConfig,
  mockGetReplyFromConfigOnce,
  agentDiscoveryMock,
  testState,
  testTailnetIPv4,
  testTailscaleWhois,
} from "./test-helpers.runtime-state.js";
/** Re-exported API for src/gateway, starting with reset Test Plugin Registry. */
export { resetTestPluginRegistry, setTestPluginRegistry } from "./test-helpers.plugin-registry.js";
/** Re-exported API for src/gateway. */
export {
  connectOk,
  connectReq,
  connectWebchatClient,
  createGatewaySuiteHarness,
  getFreePort,
  getTrackedConnectChallengeNonce,
  installGatewayTestHooks,
  onceMessage,
  readConnectChallengeNonce,
  rpcReq,
  startConnectedServerWithClient,
  startGatewayServer,
  startGatewayServerWithRetries,
  startServer,
  startServerWithClient,
  trackConnectChallengeNonce,
  waitForSystemEvent,
  withGatewayServer,
  writeSessionStore,
} from "./test-helpers.server.js";
