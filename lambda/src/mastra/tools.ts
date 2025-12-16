import { MastraLanguageModel } from '@mastra/core/memory';
import { createVectorQueryTool } from '@mastra/rag';
import { createTool } from "@mastra/core/tools";
import { embeddingModel, languageModel } from './model.js';
import { S3VectorsStoreName } from './vector.js';
import { env } from '../env.js';
import { z } from 'zod';


export const queryTool = createVectorQueryTool({
    id: 'tool_knowledgebase_s3vectors',
    description:
        'Use it to search for relevant documentation about Vantage Pro 2',
    vectorStoreName: S3VectorsStoreName,
    indexName: env.AWS_S3_VECTORS_INDEX_NAME,
    includeVectors: false,
    model: embeddingModel,
    reranker: {
        model: languageModel as unknown as MastraLanguageModel,
        options: {
            topK: 3,
        },
    },
});

export const weatherTool = createTool({
    id: "weather-tool",
    description: "Fetches temperature from weather stations for a location",
    inputSchema: z.object({
        stationId: z.string(),
    }),
    outputSchema: z.object({
        temperature: z.string(),
        unit: z.string(),
        description: z.string(),
        forecast: z.array(z.string()),
    }),
    execute: async (inputData) => {
        return {
            temperature: "10",
            unit: "C",
            description: "Sunny",
            forecast: ["10", "11", "15", "10", "4"],
        };
    },
});

export const dataTool = createTool({
    id: "data-tool",
    description: "Fetches soil moisture data from weather stations for a location",
    inputSchema: z.object({
        stationId: z.string(),
    }),
    outputSchema: z.object({
        labels: z.array(z.string()),
        legend: z.array(z.string()).optional(),
        datasets: z.array(z.object({
            data: z.array(z.number()),
            color: z.string().optional(),
            strokeWidth: z.number().optional(),
            withDots: z.boolean().optional()
        }))
    }),
    execute: async (inputData) => {
        return {
            labels: ["08-12", "09-12", "10-12", "11-12", "12-12"],
            legend: ["20cm", "50cm", "75cm"],
            datasets: [
                {
                    data: [80, 78, 108, 90, 85, 80],
                    color: "rgba(80, 119, 29, 1)",
                    strokeWidth: 2
                },
                {
                    data: [92, 91, 91, 91, 92, 91],
                    color: "rgba(120, 160, 250, 1)",
                    strokeWidth: 2
                },
                {
                    data: [101, 101, 102, 102, 101, 101],
                    color: "rgba(250, 200, 50, 1)",
                    strokeWidth: 2
                },
                {
                    data: [160],
                    withDots: false,
                    color: "transparent",
                    strokeWidth: 0
                },
                {
                    data: [0],
                    withDots: false,
                    color: "transparent",
                    strokeWidth: 0
                }
            ]
        };
    },
});

export const gddTool = createTool({
    id: "gdd-tool",
    description: "Fetches GDD data from weather stations for a location",
    inputSchema: z.object({
        stationId: z.string(),
    }),
    outputSchema: z.object({
        labels: z.array(z.string()),
        datasets: z.array(z.object({
            data: z.array(z.number())
        }))
    }),
    execute: async (inputData) => {
        return {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
                {
                    data: [5.64, 15, 7.64, 1, 8, 6.1, 10]
                }
            ]
        };
    },
});