import { Mastra } from "@mastra/core";
import { basicAgent } from "./agent.js";
import { Observability, SamplingStrategyType } from "@mastra/observability";
import { s3VectorsStore } from "./vector.js";
import { observabilityExporter } from "./observability.js";

export const mastra = new Mastra({
    agents: {
        basic: basicAgent
    },
    vectors: {
        s3vectors: s3VectorsStore
    },
    observability: new Observability({
        configs: {
            default: {
                serviceName: "warikeapp",
                sampling: { type: SamplingStrategyType.ALWAYS },
                exporters: [
                    observabilityExporter
                ],
            },
        },
    }),
})