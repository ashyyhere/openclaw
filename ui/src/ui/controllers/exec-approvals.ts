// Control UI controller for exec approval files. Loads, edits, and saves
// gateway or node-scoped approvals while tracking dirty form state.
import type { GatewayBrowserClient } from "../gateway.ts";
import { cloneConfigObject, removePathValue, setPathValue } from "./config/form-utils.ts";

/** Default exec approval modes applied across agents. */
export type ExecApprovalsDefaults = {
  security?: string;
  ask?: string;
  askFallback?: string;
  autoAllowSkills?: boolean;
};

/** Persisted exec command allowlist entry shown in the approvals editor. */
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

/** Per-agent exec approval defaults and allowlist entries. */
export type ExecApprovalsAgent = ExecApprovalsDefaults & {
  allowlist?: ExecApprovalsAllowlistEntry[];
};

/** On-disk exec approvals file shape edited by the UI. */
export type ExecApprovalsFile = {
  version?: number;
  socket?: { path?: string };
  defaults?: ExecApprovalsDefaults;
  agents?: Record<string, ExecApprovalsAgent>;
};

/** Loaded exec approvals file plus path/existence/hash metadata. */
export type ExecApprovalsSnapshot = {
  path: string;
  exists: boolean;
  hash: string;
  file: ExecApprovalsFile;
};

/** Gateway or remote node target for exec approvals RPCs. */
export type ExecApprovalsTarget = { kind: "gateway" } | { kind: "node"; nodeId: string };

/** Mutable app state required by the exec approvals controller. */
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

/** Loads exec approvals from the selected gateway or node target. */
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

/** Saves dirty exec approvals back to the selected gateway or node target. */
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

/** Updates one nested value in the editable exec approvals form. */
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

/** Removes one nested value from the editable exec approvals form. */
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
