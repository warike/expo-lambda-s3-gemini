import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { env } from './env.js';

export const google = createGoogleGenerativeAI({
  apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY
});

export const languageModel = google.languageModel("gemini-2.5-flash")
export const embeddingModel = google.textEmbeddingModel("text-embedding-004");
