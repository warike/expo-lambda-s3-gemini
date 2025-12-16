import logger from "./logger";

export const measureLatency = async <T>(fn: () => Promise<T> | T): Promise<number> => {
    const start = performance.now();
    await fn();
    const end = performance.now();
    const duration = end - start;
    return duration;
};

export const logEmbeddingStats = (label: string, modelId: string, latency: number, embedding: number[]) => {
    logger.info(`
        \n${label}: ${modelId}
        Latency: ${latency.toFixed(2)}ms
        Dimension: ${embedding.length}
        Values (first 4): ${embedding.slice(0, 4)}
    `)
};

export const logBatchEmbeddingStats = (label: string, modelId: string, latency: number, embeddings: number[][]) => {
    logger.info(`
        \n${label}: ${modelId}
        Latency: ${latency.toFixed(2)}ms
        Dimension: ${embeddings.length}
        Dimension of each embedding: ${embeddings[0].length}
    `)
};

export const logLatency = (label: string, latency: number) => {
    logger.info(`⏱️  ${label} latency: ${latency.toFixed(2)}ms`);
}
