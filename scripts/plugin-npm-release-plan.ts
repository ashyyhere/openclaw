#!/usr/bin/env -S node --import tsx
// Plugin npm release-plan CLI prints the package publish plan for selected plugins.

import { pathToFileURL } from "node:url";
import { collectPluginReleasePlan, parsePluginReleaseArgs } from "./lib/plugin-npm-release.ts";

/** Collect the plugin npm release plan from CLI-style arguments. */
export function collectPluginNpmReleasePlan(argv: string[]) {
  const { selection, selectionMode, baseRef, headRef } = parsePluginReleaseArgs(argv);
  return collectPluginReleasePlan({
    selection,
    selectionMode,
    gitRange: baseRef && headRef ? { baseRef, headRef } : undefined,
  });
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const plan = collectPluginNpmReleasePlan(process.argv.slice(2));
  console.log(JSON.stringify(plan, null, 2));
}
