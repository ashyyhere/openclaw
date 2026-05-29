/** Public SDK barrel for reusable channel contract test suites and fixtures. */
export {
  expectChannelInboundContextContract,
  expectChannelTurnDispatchResultContract,
  primeChannelOutboundSendMock,
} from "../channels/plugins/contracts/test-helpers.js";
/** Re-exported API for src/plugin-sdk, starting with build Dispatch Inbound Capture Mock. */
export { buildDispatchInboundCaptureMock } from "../channels/plugins/contracts/inbound-testkit.js";
/** Re-exported API for src/plugin-sdk. */
export {
  installChannelOutboundPayloadContractSuite,
  type OutboundPayloadHarnessParams,
} from "../channels/plugins/contracts/outbound-payload-testkit.js";
