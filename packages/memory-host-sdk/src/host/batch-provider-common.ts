// packages/memory-host-sdk/src/host batch provider common helpers and runtime behavior.
import type { EmbeddingBatchOutputLine } from "./batch-output.js";

/** Public type describing Embedding Batch Status for packages/memory-host-sdk. */
export type EmbeddingBatchStatus = {
  id?: string;
  status?: string;
  output_file_id?: string | null;
  error_file_id?: string | null;
};

/** Public type describing Provider Batch Output Line for packages/memory-host-sdk. */
export type ProviderBatchOutputLine = EmbeddingBatchOutputLine;

/** Public constant for EMBEDDING BATCH ENDPOINT behavior in packages/memory-host-sdk. */
export const EMBEDDING_BATCH_ENDPOINT = "/v1/embeddings";
