import { createVectorQueryTool } from '@mastra/rag';
import { env } from './env.js';
import { embeddingModel } from './model.js';
import { S3VectorsStoreName } from './vector.js';

export const queryTool = createVectorQueryTool({
    id: 'tool_knowledgebase_s3vectors',
    description:
        'Use it to search for relevant documentation about Vantage Pro 2',
    vectorStoreName: S3VectorsStoreName,
    indexName: env.AWS_S3_VECTORS_INDEX_NAME,
    includeVectors: false,
    model: embeddingModel
});