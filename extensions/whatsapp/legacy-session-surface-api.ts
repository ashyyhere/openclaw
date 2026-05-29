// extensions/whatsapp legacy session surface api helpers and runtime behavior.
import { canonicalizeLegacySessionKey, isLegacyGroupSessionKey } from "./src/session-contract.js";

export const whatsappLegacySessionSurface = {
  isLegacyGroupSessionKey,
  canonicalizeLegacySessionKey,
};
