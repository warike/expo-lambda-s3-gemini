import { Mastra } from "@mastra/core";
import { s3VectorsStore } from "./vector";
import { S3VectorsStoreName } from "./vector";

import { Observability, SamplingStrategyType, SensitiveDataFilter } from "@mastra/observability";
import { observabilityExporter } from "./observability";
import { basicAgent } from "./agent";

export const mastra = new Mastra({
    agents: {
        basic: basicAgent
    },
    vectors: {
        [S3VectorsStoreName]: s3VectorsStore,
    },
    observability: new Observability({
        configs: {
            deafult: {
                serviceName: "warike_app_langwatch",
                sampling: { type: SamplingStrategyType.ALWAYS },
                spanOutputProcessors: [new SensitiveDataFilter()],
                exporters: [
                    observabilityExporter
                ],
            },
        },
    }),
});