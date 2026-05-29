/** Mutable config wrapper used by doctor repair steps. */
import type { OpenClawConfig } from "../../../config/types.openclaw.js";

/** Shared type for Doctor Config Mutation State in src/commands/doctor. */
export type DoctorConfigMutationState = {
  cfg: OpenClawConfig;
  candidate: OpenClawConfig;
  pendingChanges: boolean;
  fixHints: string[];
};

/** Shared type for Doctor Config Mutation Result in src/commands/doctor. */
export type DoctorConfigMutationResult = {
  config: OpenClawConfig;
  changes: string[];
};

/** Reused helper for apply Doctor Config Mutation behavior in src/commands/doctor. */
export function applyDoctorConfigMutation(params: {
  state: DoctorConfigMutationState;
  mutation: DoctorConfigMutationResult;
  shouldRepair: boolean;
  fixHint?: string;
}): DoctorConfigMutationState {
  if (params.mutation.changes.length === 0) {
    return params.state;
  }

  return {
    cfg: params.shouldRepair ? params.mutation.config : params.state.cfg,
    candidate: params.mutation.config,
    pendingChanges: true,
    fixHints:
      !params.shouldRepair && params.fixHint
        ? [...params.state.fixHints, params.fixHint]
        : params.state.fixHints,
  };
}
