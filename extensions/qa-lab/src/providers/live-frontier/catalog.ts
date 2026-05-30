// QA Lab live-frontier catalog helpers name the provider set and default models.
/** Live provider ids expected in the frontier catalog lane. */
export const QA_FRONTIER_PROVIDER_IDS = ["anthropic", "google", "openai"] as const;
/** Preferred model for live-frontier catalog validation. */
export const QA_FRONTIER_CATALOG_PRIMARY_MODEL = "openai/gpt-5.5";
/** Alternate model used to prove multi-provider catalog coverage. */
export const QA_FRONTIER_CATALOG_ALTERNATE_MODEL = "anthropic/claude-sonnet-4-6";

/** Checks whether a model ref is the preferred live-frontier catalog model. */
export function isPreferredQaLiveFrontierCatalogModel(modelRef: string) {
  return modelRef === QA_FRONTIER_CATALOG_PRIMARY_MODEL;
}
