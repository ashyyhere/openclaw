// Command authorization gates shared by channel ingress paths.
/** One configured command authorization source and its decision. */
export type CommandAuthorizer = {
  configured: boolean;
  allowed: boolean;
};

/** Fallback mode used when access groups are disabled. */
export type CommandGatingModeWhenAccessGroupsOff = "allow" | "deny" | "configured";

/** Resolve command authorization from one or more authorizer decisions. */
export function resolveCommandAuthorizedFromAuthorizers(params: {
  useAccessGroups: boolean;
  authorizers: CommandAuthorizer[];
  modeWhenAccessGroupsOff?: CommandGatingModeWhenAccessGroupsOff;
}): boolean {
  const { useAccessGroups, authorizers } = params;
  const mode = params.modeWhenAccessGroupsOff ?? "allow";
  if (!useAccessGroups) {
    if (mode === "allow") {
      return true;
    }
    if (mode === "deny") {
      return false;
    }
    const anyConfigured = authorizers.some((entry) => entry.configured);
    if (!anyConfigured) {
      return true;
    }
    return authorizers.some((entry) => entry.configured && entry.allowed);
  }
  return authorizers.some((entry) => entry.configured && entry.allowed);
}

/** Resolve whether a detected control command should run or be blocked. */
export function resolveControlCommandGate(params: {
  useAccessGroups: boolean;
  authorizers: CommandAuthorizer[];
  allowTextCommands: boolean;
  hasControlCommand: boolean;
  modeWhenAccessGroupsOff?: CommandGatingModeWhenAccessGroupsOff;
}): { commandAuthorized: boolean; shouldBlock: boolean } {
  const commandAuthorized = resolveCommandAuthorizedFromAuthorizers({
    useAccessGroups: params.useAccessGroups,
    authorizers: params.authorizers,
    modeWhenAccessGroupsOff: params.modeWhenAccessGroupsOff,
  });
  const shouldBlock = params.allowTextCommands && params.hasControlCommand && !commandAuthorized;
  return { commandAuthorized, shouldBlock };
}

/** Resolve command gates for dual text/native command surfaces. */
export function resolveDualTextControlCommandGate(params: {
  useAccessGroups: boolean;
  primaryConfigured: boolean;
  primaryAllowed: boolean;
  secondaryConfigured: boolean;
  secondaryAllowed: boolean;
  hasControlCommand: boolean;
  modeWhenAccessGroupsOff?: CommandGatingModeWhenAccessGroupsOff;
}): { commandAuthorized: boolean; shouldBlock: boolean } {
  return resolveControlCommandGate({
    useAccessGroups: params.useAccessGroups,
    authorizers: [
      { configured: params.primaryConfigured, allowed: params.primaryAllowed },
      { configured: params.secondaryConfigured, allowed: params.secondaryAllowed },
    ],
    allowTextCommands: true,
    hasControlCommand: params.hasControlCommand,
    modeWhenAccessGroupsOff: params.modeWhenAccessGroupsOff,
  });
}
