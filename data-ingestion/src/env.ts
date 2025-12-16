// src/env.ts
import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    AWS_REGION: z.string().default("us-west-2"),
    AWS_PROFILE: z.string().min(1),

    AWS_S3_VECTORS_BUCKET_NAME: z.string().min(1),
    AWS_S3_VECTORS_INDEX_NAME: z.string().min(1),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),

    LANGWATCH_API_KEY: z.string().min(1),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error("❌ Invalid environment variables:", _env.error.flatten().fieldErrors);
    process.exit(1);
}

export const env = _env.data;