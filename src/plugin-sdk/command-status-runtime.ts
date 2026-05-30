import { createLazyRuntimeMethodBinder, createLazyRuntimeModule } from "../shared/lazy-runtime.js";

type CommandStatusRuntime = typeof import("./command-status.runtime.js");

const loadCommandStatusRuntime = createLazyRuntimeModule(
  () => import("./command-status.runtime.js"),
);
const bindCommandStatusRuntime = createLazyRuntimeMethodBinder(loadCommandStatusRuntime);

export type { ResolveDirectStatusReplyForSessionParams } from "./command-status.runtime.js";

/** Resolve `/status` output for a requested session without eagerly loading reply internals. */
export const resolveDirectStatusReplyForSession: CommandStatusRuntime["resolveDirectStatusReplyForSession"] =
  bindCommandStatusRuntime((runtime) => runtime.resolveDirectStatusReplyForSession);
