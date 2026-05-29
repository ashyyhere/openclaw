/** Public option enums for subagent spawn mode, sandbox mode, and context mode. */
export const SUBAGENT_SPAWN_MODES = ["run", "session"] as const;
/** Whether a spawn creates a one-shot run or reusable child session. */
export type SpawnSubagentMode = (typeof SUBAGENT_SPAWN_MODES)[number];

/** Reused constant for SUBAGENT SPAWN SANDBOX MODES behavior in src/agents. */
export const SUBAGENT_SPAWN_SANDBOX_MODES = ["inherit", "require"] as const;
/** Sandbox policy for spawned subagent execution. */
export type SpawnSubagentSandboxMode = (typeof SUBAGENT_SPAWN_SANDBOX_MODES)[number];

/** Reused constant for SUBAGENT SPAWN CONTEXT MODES behavior in src/agents. */
export const SUBAGENT_SPAWN_CONTEXT_MODES = ["isolated", "fork"] as const;
/** Context inheritance mode for spawned subagent sessions. */
export type SpawnSubagentContextMode = (typeof SUBAGENT_SPAWN_CONTEXT_MODES)[number];
