#!/usr/bin/env node
// Plugin SDK usage analyzer forwards to the topology CLI with the plugin-sdk scope.
import { main } from "./ts-topology.ts";

const forwardedArgs = process.argv.slice(2);
const normalizedArgs = forwardedArgs[0] === "--" ? forwardedArgs.slice(1) : forwardedArgs;
const exitCode = await main(["--scope=plugin-sdk", ...normalizedArgs]);
if (exitCode !== 0) {
  process.exit(exitCode);
}
