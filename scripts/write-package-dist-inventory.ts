#!/usr/bin/env -S node --import tsx
// Package dist inventory writer records release package artifact metadata.

import { pathToFileURL } from "node:url";
import { writePackageDistInventory } from "../src/infra/package-dist-inventory.ts";

/** Write the package dist inventory for the current repository root. */
export async function writeCurrentPackageDistInventory(): Promise<void> {
  await writePackageDistInventory(process.cwd());
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  await writeCurrentPackageDistInventory();
}
