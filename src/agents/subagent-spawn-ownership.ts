import type { OpenClawConfig } from "../config/types.openclaw.js";
import {
  resolveDisplaySessionKey,
  resolveInternalSessionKey,
  resolveMainSessionAlias,
} from "./tools/sessions-helpers.js";

/** Controller and completion owner keys assigned to a spawned subagent. */
export type SubagentSpawnOwnership = {
  controllerSessionKey: string;
  threadBindingRequesterSessionKey: string;
  completionRequesterSessionKey: string;
  completionRequesterDisplayKey: string;
};

/** Resolve controller/completion ownership for a subagent spawn request. */
export function resolveSubagentSpawnOwnership(params: {
  cfg: OpenClawConfig;
  agentSessionKey?: string;
  completionOwnerKey?: string;
}): SubagentSpawnOwnership {
  const { mainKey, alias } = resolveMainSessionAlias(params.cfg);
  const controllerSessionKey = params.agentSessionKey
    ? resolveInternalSessionKey({
        key: params.agentSessionKey,
        alias,
        mainKey,
      })
    : alias;
  const completionOwnerKey = params.completionOwnerKey?.trim();
  const completionRequesterSessionKey = completionOwnerKey
    ? resolveInternalSessionKey({
        key: completionOwnerKey,
        alias,
        mainKey,
      })
    : controllerSessionKey;
  const completionRequesterDisplayKey = resolveDisplaySessionKey({
    key: completionRequesterSessionKey,
    alias,
    mainKey,
  });

  return {
    controllerSessionKey,
    threadBindingRequesterSessionKey: controllerSessionKey,
    completionRequesterSessionKey,
    completionRequesterDisplayKey,
  };
}
