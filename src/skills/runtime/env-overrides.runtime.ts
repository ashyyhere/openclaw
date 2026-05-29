/** Runtime wrapper for skill environment override key lookup. */
import { getActiveSkillEnvKeys as getActiveSkillEnvKeysImpl } from "./env-overrides.js";

type GetActiveSkillEnvKeys = typeof import("./env-overrides.js").getActiveSkillEnvKeys;

/** Returns active skill env keys through the runtime boundary. */
export function getActiveSkillEnvKeys(
  ...args: Parameters<GetActiveSkillEnvKeys>
): ReturnType<GetActiveSkillEnvKeys> {
  return getActiveSkillEnvKeysImpl(...args);
}
