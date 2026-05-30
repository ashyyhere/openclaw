// Minimal model fallback runtime mock for tests that only need the primary run result.
/** Run the primary model once and return the fallback-shaped result wrapper. */
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
