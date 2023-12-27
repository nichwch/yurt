import { pipeline, } from "@xenova/transformers"
export const getHFEmbedding = async (text) => {
    const embeddingFunction = await pipeline(
      "feature-extraction",
      "Supabase/gte-small"
    );
    const embeddingResponse = await embeddingFunction(text, {
      pooling: "mean",
      normalize: true,
    });
    const embedding = embeddingResponse.data;
    return Array.from(embedding);
  }