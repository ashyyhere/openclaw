import type { CliOutboundSendSource } from "./outbound-send-mapping.js";

/** CLI dependency bag, currently backed by dynamic outbound-send channel adapters. */
export type CliDeps = CliOutboundSendSource;
