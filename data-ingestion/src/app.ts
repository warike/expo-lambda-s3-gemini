import logger from "./logger.js"
import { MDocument } from "@mastra/rag";
import { install } from "../assets/install.js";
import { usage } from "../assets/usage.js";
import { logLatency, measureLatency } from "./utils.js";
import { embeddingModel } from "./model.js";
import { embed, embedMany } from "ai";
import { mastra } from "./mastra.js";
import { S3VectorsStoreName, VectorIndex } from "./vector.js";

const createEmbedding = async () => {

    try {
        // Create document from markdown sources
        const doc_install = MDocument.fromMarkdown(install, {
            "type": "guide",
            "doc_id": "manual::vantage-pro2::console-user-manual-davis-instruments",
            "key": "07395_234_Manual_VP2_Console_RevZ_web.pdf",
            "product": "Davis Vantage Pro2 Console",
            "sections": [
                "Compliance (FCC, IC, EC)",
                "Console Powering (Cabled vs. Wireless)",
                "Console Location and Mounting",
                "Setup Mode Commands",
                "Configuring Wireless Transmitter IDs and Retransmit",
                "Time, Date, and Time Zone Settings (UTC, DST)",
                "Geographic and Elevation Setup (Latitude, Longitude)",
                "Sensor Configuration (Wind Cup, Rain Collector, Rain Season)",
                "Serial Baud Rate and Clear All Command"
            ],
            "keywords": [
                "Installation", "Setup Mode", "Power", "Wireless", "Elevation", "Time Zone", "Rain Collector", "Baud Rate", "Clear All"
            ]
        });
        const doc_usage = MDocument.fromMarkdown(usage, {
            "type": "guide",
            "doc_id": "manual::vantage-pro2::console-user-manual-davis-instruments",
            "product": "Davis Vantage Pro2 Console",
            "sections": [
                "Current Weather Mode: Data Display and Units",
                "Variable Selection and Graphing",
                "Calibrating and Setting Variables (Temperature, Wind, Barometer, Rain)",
                "Highs and Lows Mode",
                "Alarm Mode: Setting Thresholds and Silencing",
                "Graph Mode: Viewing Historical Data (24 Hour/Day/Month/Year)",
                "Wireless Repeater Configuration (Setup Appendix)"
            ],
            "keywords": [
                "Current Weather", "Calibrate", "Alarm",
            ]
        });

        await doc_install.chunk({
            strategy: "semantic-markdown",
            joinThreshold: 500,
        });
        await doc_usage.chunk({
            strategy: "semantic-markdown",
            joinThreshold: 500,
        });

        // Retrieve chunked documents
        const chunk_install = doc_install.getDocs();
        const chunk_usage = doc_usage.getDocs();

        // Generate embeddings for each chunk
        const { embeddings: googleEmbeddingsInstall } = await embedMany({
            model: embeddingModel,
            values: chunk_install.map((doc) => doc.text),
        });

        const { embeddings: googleEmbeddingsUsage } = await embedMany({
            model: embeddingModel,
            values: chunk_usage.map((doc) => doc.text),
        });

        // Get s3 vector store client
        const s3Vector = mastra.getVector(S3VectorsStoreName);
        // Delete any existing index for fresh start
        const indexes = await s3Vector.listIndexes()
        if (indexes.includes(VectorIndex)) {
            const { dimension, metric, count } = await s3Vector.describeIndex({
                indexName: VectorIndex,
            })
            logger.info(`ℹ️  Index ${VectorIndex} already exists with dimension ${dimension}, metric ${metric}, count ${count}`)
        }

        logLatency("Embedding dimension", googleEmbeddingsInstall[0].length);
        await s3Vector.upsert({
            indexName: VectorIndex,
            vectors: googleEmbeddingsInstall,
            metadata: chunk_install.map((chunk) => ({
                ...chunk.metadata,
                text: chunk.text,
            })),
        })

        await s3Vector.upsert({
            indexName: VectorIndex,
            vectors: googleEmbeddingsUsage,
            metadata: chunk_usage.map((chunk) => ({
                ...chunk.metadata,
                text: chunk.text,
            })),
        })

    } catch (error) {
        logger.error(error)
    }
}

const searchEmbedding = async () => {
    const query = "Why do I have to specify the month of the year that rain starts?"
    logger.info("------------------------------")
    logger.info(`Start similarity search: ${VectorIndex}`)

    const { embedding } = await embed({
        model: embeddingModel,
        value: query,
    });

    try {
        const s3Vector = mastra.getVector(S3VectorsStoreName);
        const results = await s3Vector.query({
            indexName: VectorIndex,
            queryVector: embedding,
            topK: 5,
        });
        logger.info(`ℹ️ Similarity search results: ${results.length}`);
    } catch (error) {
        logger.error(error)
    }
}


export const IngestData = async () => {
    logger.info("------------------------------")
    logger.info("S3 Vectors - Ingesting data 🚀")
    logger.info("------------------------------")


    const embedding_latency = await measureLatency(() => createEmbedding())
    const search_latency = await measureLatency(() => searchEmbedding())
    logLatency("Embedding latency", embedding_latency);
    logLatency("Search latency", search_latency);

}