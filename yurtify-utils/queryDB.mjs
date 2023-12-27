import { searchVector } from "@orama/orama";
import { getHFEmbedding } from "./getHFEmbedding.mjs";

/** @param {string} query */
export const queryDB = async (db, query, similarity = 0.7, limit = 1000) => {
    console.log('embedding query ', query)
    const queryEmbedding = await getHFEmbedding(query);
    console.log('querying results for ',query)
    const results = await searchVector(db, {
      vector: queryEmbedding,
      property: "embedding",
      similarity,
      limit,
    });
    return results;
  }