// packages/memory-host-sdk/src/host node llama helpers and runtime behavior.
/** Public type describing Llama Embedding for packages/memory-host-sdk. */
export type LlamaEmbedding = {
  vector: Float32Array | number[];
};

/** Public type describing Llama Embedding Context for packages/memory-host-sdk. */
export type LlamaEmbeddingContext = {
  getEmbeddingFor: (text: string) => Promise<LlamaEmbedding>;
  dispose?: () => Promise<void> | void;
};

/** Public type describing Llama Model for packages/memory-host-sdk. */
export type LlamaModel = {
  createEmbeddingContext: (options?: {
    contextSize?: number | "auto";
    createSignal?: AbortSignal;
  }) => Promise<LlamaEmbeddingContext>;
  dispose?: () => Promise<void> | void;
};

/** Public type describing Resolve Model File Options for packages/memory-host-sdk. */
export type ResolveModelFileOptions = {
  directory?: string;
  signal?: AbortSignal;
};

/** Public type describing Llama for packages/memory-host-sdk. */
export type Llama = {
  loadModel: (params: { modelPath: string; loadSignal?: AbortSignal }) => Promise<LlamaModel>;
  dispose?: () => Promise<void> | void;
};

/** Public type describing Node Llama Cpp Module for packages/memory-host-sdk. */
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

/** Public helper for import Node Llama Cpp behavior in packages/memory-host-sdk. */
export async function importNodeLlamaCpp() {
  return import(NODE_LLAMA_CPP_MODULE) as Promise<NodeLlamaCppModule>;
}
