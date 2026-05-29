/** Finds lightweight routed commands for raw CLI argv. */
import { routedCommands, type RouteSpec } from "./route-specs.js";

/** Re-exported API for src/cli/program, starting with Route Spec. */
export type { RouteSpec } from "./route-specs.js";

/** Reused helper for find Routed Command behavior in src/cli/program. */
export function findRoutedCommand(path: string[], argv?: string[]): RouteSpec | null {
  for (const route of routedCommands) {
    if (route.matches(path)) {
      if (argv && route.canRun && !route.canRun(argv)) {
        continue;
      }
      return route;
    }
  }
  return null;
}
