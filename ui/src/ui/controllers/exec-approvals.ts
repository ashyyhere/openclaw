// ui/src/ui/controllers exec approvals helpers and runtime behavior.
import type { GatewayBrowserClient } from "../gateway.ts";
import { cloneConfigObject, removePathValue, setPathValue } from "./config/form-utils.ts";

/** Shared type for Exec Approvals Defaults in ui/src/ui/controllers. */
export type ExecApprovalsDefaults = {
  security?: string;
  ask?: string;
  askFallback?: string;
  autoAllowSkills?: boolean;
};

/** Shared type for Exec Approvals Allowlist Entry in ui/src/ui/controllers. */
export type ExecApprovalsAllowlistEntry = {
  id?: string;
  pattern: string;
  source?: "allow-always";
  commandText?: string;
  argPattern?: string;
  lastUsedAt?: number;
  lastUsedCommand?: string;
  lastResolvedPath?: string;
};

/** Shared type for Exec Approvals Agent in ui/src/ui/controllers. */
export type ExecApprovalsAgent = ExecApprovalsDefaults & {
  allowlist?: ExecApprovalsAllowlistEntry[];
};

/** Shared type for Exec Approvals File in ui/src/ui/controllers. */
export type ExecApprovalsFile = {
  version?: number;
  socket?: { path?: string };
  defaults?: ExecApprovalsDefaults;
  agents?: Record<string, ExecApprovalsAgent>;
};

/** Shared type for Exec Approvals Snapshot in ui/src/ui/controllers. */
export type ExecApprovalsSnapshot = {
  path: string;
  exists: boolean;
  hash: string;
  file: ExecApprovalsFile;
};

/** Shared type for Exec Approvals Target in ui/src/ui/controllers. */
export type ExecApprovalsTarget = { kind: "gateway" } | { kind: "node"; nodeId: string };

/** Shared type for Exec Approvals State in ui/src/ui/controllers. */
export type ExecApprovalsState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  execApprovalsLoading: boolean;
  execApprovalsSaving: boolean;
  execApprovalsDirty: boolean;
  execApprovalsSnapshot: ExecApprovalsSnapshot | null;
  execApprovalsForm: ExecApprovalsFile | null;
  execApprovalsSelectedAgent: string | null;
  lastError: string | null;
};

function resolveExecApprovalsRpc(target?: ExecApprovalsTarget | null): {
  method: string;
  params: Record<string, unknown>;
} | null {
  if (!target || target.kind === "gateway") {
    return { method: "exec.approvals.get", params: {} };
  }
  const nodeId = target.nodeId.trim();
  if (!nodeId) {
    return null;
  }
  return { method: "exec.approvals.node.get", params: { nodeId } };
}

function resolveExecApprovalsSaveRpc(
  target: ExecApprovalsTarget | null | undefined,
  params: { file: ExecApprovalsFile; baseHash: string },
): { method: string; params: Record<string, unknown> } | null {
  if (!target || target.kind === "gateway") {
    return { method: "exec.approvals.set", params };
  }
  const nodeId = target.nodeId.trim();
  if (!nodeId) {
    return null;
  }
  return { method: "exec.approvals.node.set", params: { ...params, nodeId } };
}

/** Reused helper for load Exec Approvals behavior in ui/src/ui/controllers. */
export async function loadExecApprovals(
  state: ExecApprovalsState,
  target?: ExecApprovalsTarget | null,
) {
  if (!state.client || !state.connected) {
    return;
  }
  if (state.execApprovalsLoading) {
    return;
  }
  state.execApprovalsLoading = true;
  state.lastError = null;
  try {
    const rpc = resolveExecApprovalsRpc(target);
    if (!rpc) {
      state.lastError = "Select a node before loading exec approvals.";
      return;
    }
    const res = await state.client.request<ExecApprovalsSnapshot>(rpc.method, rpc.params);
    applyExecApprovalsSnapshot(state, res);
  } catch (err) {
    state.lastError = String(err);
  } finally {
    state.execApprovalsLoading = false;
  }
}

function applyExecApprovalsSnapshot(state: ExecApprovalsState, snapshot: ExecApprovalsSnapshot) {
  state.execApprovalsSnapshot = snapshot;
  if (!state.execApprovalsDirty) {
    state.execApprovalsForm = cloneConfigObject(snapshot.file ?? {});
  }
}

/** Reused helper for save Exec Approvals behavior in ui/src/ui/controllers. */
export async function saveExecApprovals(
  state: ExecApprovalsState,
  target?: ExecApprovalsTarget | null,
) {
  if (!state.client || !state.connected) {
    return;
  }
  state.execApprovalsSaving = true;
  state.lastError = null;
  try {
    const baseHash = state.execApprovalsSnapshot?.hash;
    if (!baseHash) {
      state.lastError = "Exec approvals hash missing; reload and retry.";
      return;
    }
    const file = state.execApprovalsForm ?? state.execApprovalsSnapshot?.file ?? {};
    const rpc = resolveExecApprovalsSaveRpc(target, { file, baseHash });
    if (!rpc) {
      state.lastError = "Select a node before saving exec approvals.";
      return;
    }
    await state.client.request(rpc.method, rpc.params);
    state.execApprovalsDirty = false;
    await loadExecApprovals(state, target);
  } catch (err) {
    state.lastError = String(err);
  } finally {
    state.execApprovalsSaving = false;
  }
}

/** Reused helper for update Exec Approvals Form Value behavior in ui/src/ui/controllers. */
export function updateExecApprovalsFormValue(
  state: ExecApprovalsState,
  path: Array<string | number>,
  value: unknown,
) {
  const base = cloneConfigObject(
    state.execApprovalsForm ?? state.execApprovalsSnapshot?.file ?? {},
  );
  setPathValue(base, path, value);
  state.execApprovalsForm = base;
  state.execApprovalsDirty = true;
}

/** Reused helper for remove Exec Approvals Form Value behavior in ui/src/ui/controllers. */
export function removeExecApprovalsFormValue(
  state: ExecApprovalsState,
  path: Array<string | number>,
) {
  const base = cloneConfigObject(
    state.execApprovalsForm ?? state.execApprovalsSnapshot?.file ?? {},
  );
  removePathValue(base, path);
  state.execApprovalsForm = base;
  state.execApprovalsDirty = true;
}
