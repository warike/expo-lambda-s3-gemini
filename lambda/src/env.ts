// src/env.ts
import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    AWS_REGION: z.string().default("us-west-2"),

    GOOGLE_GENERATIVE_AI_API_KEY: z.string().default(""),
    GOOGLE_LANGUAGE_MODEL: z.string().default("gemini-2.5-flash"),
    GOOGLE_EMBEDDING_MODEL: z.string().default("text-embedding-004"),

    AWS_S3_VECTORS_BUCKET_NAME: z.string().default(""),
    AWS_S3_VECTORS_INDEX_NAME: z.string().default(""),

    LANGWATCH_API_KEY: z.string().default(""),

    CLERK_SECRET_KEY: z.string().default("sk_test_1234567890"),
    LOG_LEVEL: z.string().default("info"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error("❌ Invalid environment variables:", _env.error.flatten().fieldErrors);
    process.exit(1);
}

export const env = _env.data;