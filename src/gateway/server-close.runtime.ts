// Runtime boundary for gateway server close runtime behavior.
export * from "./server-close.js";
/** Re-exported API for src/gateway, starting with drain Active Sessions For Shutdown. */
export { drainActiveSessionsForShutdown } from "./session-reset-service.js";
