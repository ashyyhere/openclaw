// src/auto-reply/reply get reply directive aliases helpers and runtime behavior.
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalString,
} from "../../shared/string-coerce.js";
import type { SkillCommandSpec } from "../../skills/types.js";

/** Reused helper for reserve Skill Command Names behavior in src/auto-reply/reply. */
export function reserveSkillCommandNames(params: {
  reservedCommands: Set<string>;
  skillCommands: SkillCommandSpec[];
}) {
  for (const command of params.skillCommands) {
    params.reservedCommands.add(normalizeLowercaseStringOrEmpty(command.name));
  }
}

/** Reused helper for resolve Configured Directive Aliases behavior in src/auto-reply/reply. */
export function resolveConfiguredDirectiveAliases(params: {
  cfg: OpenClawConfig;
  commandTextHasSlash: boolean;
  reservedCommands: Set<string>;
}) {
  if (!params.commandTextHasSlash) {
    return [];
  }
  return Object.values(params.cfg.agents?.defaults?.models ?? {})
    .map((entry) => normalizeOptionalString(entry.alias))
    .filter((alias): alias is string => Boolean(alias))
    .filter((alias) => !params.reservedCommands.has(normalizeLowercaseStringOrEmpty(alias)));
}
