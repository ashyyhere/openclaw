// test-utils model fallback mock helpers and runtime behavior.
/** Reused helper for run With Model Fallback behavior in src/test-utils. */
export async function runWithModelFallback(params: {
  provider: string;
  model: string;
  run: (
    provider: string,
    model: string,
    options?: { allowTransientCooldownProbe?: boolean },
  ) => Promise<unknown>;
}) {
  return {
    result: await params.run(params.provider, params.model),
    provider: params.provider,
    model: params.model,
  };
}
