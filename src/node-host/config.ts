// Persistent node-host identity and gateway connection config.
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { resolveStateDir } from "../config/paths.js";
import { writeJson } from "../infra/json-files.js";

/** Gateway endpoint persisted for the node-host process. */
export type NodeHostGatewayConfig = {
  host?: string;
  port?: number;
  tls?: boolean;
  tlsFingerprint?: string;
};

type NodeHostConfig = {
  version: 1;
  nodeId: string;
  token?: string;
  displayName?: string;
  gateway?: NodeHostGatewayConfig;
};

const NODE_HOST_FILE = "node.json";

function resolveNodeHostConfigPath(): string {
  return path.join(resolveStateDir(), NODE_HOST_FILE);
}

function normalizeConfig(config: Partial<NodeHostConfig> | null): NodeHostConfig {
  const base: NodeHostConfig = {
    version: 1,
    nodeId: "",
    token: config?.token,
    displayName: config?.displayName,
    gateway: config?.gateway,
  };
  if (config?.version === 1 && typeof config.nodeId === "string") {
    base.nodeId = config.nodeId.trim();
  }
  if (!base.nodeId) {
    base.nodeId = crypto.randomUUID();
  }
  return base;
}

/** Load and normalize node-host config from the OpenClaw state directory. */
export async function loadNodeHostConfig(): Promise<NodeHostConfig | null> {
  const filePath = resolveNodeHostConfigPath();
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<NodeHostConfig>;
    return normalizeConfig(parsed);
  } catch {
    return null;
  }
}

/** Persist node-host config with private file permissions. */
export async function saveNodeHostConfig(config: NodeHostConfig): Promise<void> {
  const filePath = resolveNodeHostConfigPath();
  await writeJson(filePath, config, { mode: 0o600 });
}

/** Load or create node-host config, guaranteeing a stable node id. */
export async function ensureNodeHostConfig(): Promise<NodeHostConfig> {
  const existing = await loadNodeHostConfig();
  const normalized = normalizeConfig(existing);
  await saveNodeHostConfig(normalized);
  return normalized;
}
