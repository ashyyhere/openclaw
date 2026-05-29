// infra ports types helpers and runtime behavior.
/** Shared type for Port Listener in src/infra. */
export type PortListener = {
  pid?: number;
  ppid?: number;
  command?: string;
  commandLine?: string;
  user?: string;
  address?: string;
};

/** Shared type for Port Connection Direction in src/infra. */
export type PortConnectionDirection = "client" | "server" | "unknown";

/** Shared type for Port Connection in src/infra. */
export type PortConnection = PortListener & {
  direction: PortConnectionDirection;
};

/** Shared type for Port Usage Status in src/infra. */
export type PortUsageStatus = "free" | "busy" | "unknown";

/** Shared type for Port Usage in src/infra. */
export type PortUsage = {
  port: number;
  status: PortUsageStatus;
  listeners: PortListener[];
  hints: string[];
  detail?: string;
  errors?: string[];
};

/** Shared type for Port Listener Kind in src/infra. */
export type PortListenerKind = "gateway" | "ssh" | "unknown";

/** Shared type for Port Connections in src/infra. */
export type PortConnections = {
  port: number;
  connections: PortConnection[];
  detail?: string;
  errors?: string[];
};
