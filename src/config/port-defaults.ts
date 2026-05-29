// config port defaults helpers and runtime behavior.
type PortRange = { start: number; end: number };

function isValidPort(port: number): boolean {
  return Number.isFinite(port) && port > 0 && port <= 65535;
}

function clampPort(port: number, fallback: number): number {
  return isValidPort(port) ? port : fallback;
}

function derivePort(base: number, offset: number, fallback: number): number {
  return clampPort(base + offset, fallback);
}

/** Reused constant for DEFAULT BROWSER CDP PORT RANGE START behavior in src/config. */
export const DEFAULT_BROWSER_CDP_PORT_RANGE_START = 18800;
/** Reused constant for DEFAULT BROWSER CDP PORT RANGE END behavior in src/config. */
export const DEFAULT_BROWSER_CDP_PORT_RANGE_END = 18899;
const DEFAULT_BROWSER_CDP_PORT_RANGE_SPAN =
  DEFAULT_BROWSER_CDP_PORT_RANGE_END - DEFAULT_BROWSER_CDP_PORT_RANGE_START;

/** Reused helper for derive Default Browser Cdp Port Range behavior in src/config. */
export function deriveDefaultBrowserCdpPortRange(browserControlPort: number): PortRange {
  const start = derivePort(browserControlPort, 9, DEFAULT_BROWSER_CDP_PORT_RANGE_START);
  const end = start + DEFAULT_BROWSER_CDP_PORT_RANGE_SPAN;
  if (end <= 65535) {
    return { start, end };
  }
  return {
    start: DEFAULT_BROWSER_CDP_PORT_RANGE_START,
    end: DEFAULT_BROWSER_CDP_PORT_RANGE_END,
  };
}
