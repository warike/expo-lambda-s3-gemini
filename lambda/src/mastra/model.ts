import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { env } from "../env.js";

export const google = createGoogleGenerativeAI({
  apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY
});

export const languageModel = google.languageModel(env.GOOGLE_LANGUAGE_MODEL)
export const embeddingModel = google.textEmbeddingModel(env.GOOGLE_EMBEDDING_MODEL);