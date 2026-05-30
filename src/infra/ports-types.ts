// Port diagnostics contracts shared by probing, inspection, and formatting helpers.
/** Process/socket metadata for a listener using a local port. */
export type PortListener = {
  pid?: number;
  ppid?: number;
  command?: string;
  commandLine?: string;
  user?: string;
  address?: string;
};

/** Direction assigned to an inspected port connection. */
export type PortConnectionDirection = "client" | "server" | "unknown";

/** Port connection metadata with direction classification. */
export type PortConnection = PortListener & {
  direction: PortConnectionDirection;
};

/** High-level availability status for a local port. */
export type PortUsageStatus = "free" | "busy" | "unknown";

/** Port usage diagnostics returned by inspect/probe helpers. */
export type PortUsage = {
  port: number;
  status: PortUsageStatus;
  listeners: PortListener[];
  hints: string[];
  detail?: string;
  errors?: string[];
};

/** Recognized listener kind for user-facing port hints. */
export type PortListenerKind = "gateway" | "ssh" | "unknown";

/** Connection list for a port inspection query. */
export type PortConnections = {
  port: number;
  connections: PortConnection[];
  detail?: string;
  errors?: string[];
};
