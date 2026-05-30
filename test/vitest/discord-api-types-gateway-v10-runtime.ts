// Runtime CommonJS bridge for discord-api-types Gateway v10 values in Vitest.
import { createRequire } from "node:module";
import type * as DiscordGatewayApiTypes from "discord-api-types/gateway/v10";

const requireDiscordGatewayApiTypes = createRequire(import.meta.url);
const discordGatewayApiTypes = requireDiscordGatewayApiTypes(
  "discord-api-types/gateway/v10",
) as typeof DiscordGatewayApiTypes;

/** Default Gateway v10 runtime module object from discord-api-types. */
export default discordGatewayApiTypes;
/** Named Gateway v10 constants re-exported for ESM test imports. */
export const {
  GatewayCloseCodes,
  GatewayDispatchEvents,
  GatewayIntentBits,
  GatewayOpcodes,
  GatewayVersion,
  VoiceChannelEffectSendAnimationType,
} = discordGatewayApiTypes;
