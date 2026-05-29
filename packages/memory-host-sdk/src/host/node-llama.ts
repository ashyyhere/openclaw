// node-llama-cpp dynamic import contracts for local embedding provider support.
/** Embedding vector shape returned by node-llama-cpp. */
export type LlamaEmbedding = {
  vector: Float32Array | number[];
};

/** Embedding context capable of producing vectors and releasing native resources. */
export type LlamaEmbeddingContext = {
  getEmbeddingFor: (text: string) => Promise<LlamaEmbedding>;
  dispose?: () => Promise<void> | void;
};

/** Loaded llama model handle used to create embedding contexts. */
export type LlamaModel = {
  createEmbeddingContext: (options?: {
    contextSize?: number | "auto";
    createSignal?: AbortSignal;
  }) => Promise<LlamaEmbeddingContext>;
  dispose?: () => Promise<void> | void;
};

/** Options accepted by node-llama-cpp model resolution. */
export type ResolveModelFileOptions = {
  directory?: string;
  signal?: AbortSignal;
};

/** Runtime handle returned by node-llama-cpp getLlama. */
export type Llama = {
  loadModel: (params: { modelPath: string; loadSignal?: AbortSignal }) => Promise<LlamaModel>;
  dispose?: () => Promise<void> | void;
};

/** Narrow node-llama-cpp surface used by the memory host SDK. */
export type NodeLlamaCppModule = {
  LlamaLogLevel: {
    error: number;
  };
  getLlama: (params: { logLevel: number }) => Promise<Llama>;
  resolveModelFile: (
    modelPath: string,
    optionsOrDirectory?: string | ResolveModelFileOptions,
  ) => Promise<string>;
};

const NODE_LLAMA_CPP_MODULE = "node-llama-cpp";

/** Imports node-llama-cpp lazily so local model support stays optional at startup. */
export async function importNodeLlamaCpp() {
  return import(NODE_LLAMA_CPP_MODULE) as Promise<NodeLlamaCppModule>;
}
