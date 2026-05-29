// Shared remote embedding batch provider contracts.
import type { EmbeddingBatchOutputLine } from "./batch-output.js";

/** Minimal provider batch status shape used by batch polling and completion code. */
export type EmbeddingBatchStatus = {
  id?: string;
  status?: string;
  output_file_id?: string | null;
  error_file_id?: string | null;
};

/** Provider output line shape after normalizing embedding batch results. */
export type ProviderBatchOutputLine = EmbeddingBatchOutputLine;

/** OpenAI-compatible endpoint used for embedding requests inside batch files. */
export const EMBEDDING_BATCH_ENDPOINT = "/v1/embeddings";
