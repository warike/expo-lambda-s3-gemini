import { S3Vectors } from "@mastra/s3vectors";
import { env } from "./env.js";


export const VectorIndex = env.AWS_S3_VECTORS_INDEX_NAME || "default-vector-index";
export const S3VectorsStoreName = "s3vectors";

export const s3VectorsStore = new S3Vectors({
    id: S3VectorsStoreName,
    vectorBucketName: env.AWS_S3_VECTORS_BUCKET_NAME!,
    clientConfig: {
        region: env.AWS_REGION!
    },
});