import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
});

export enum LanguageModel {
    GEMINI_2_5_FLASH = 'gemini-2.5-flash'
}