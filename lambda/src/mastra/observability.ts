import { OtelExporter } from "@mastra/otel-exporter";
import { env } from "../env.js";

export const observabilityExporter = new OtelExporter({
    provider: {
        custom: {
            endpoint: "https://app.langwatch.ai/api/otel/v1/traces",
            headers: { "Authorization": `Bearer ${env.LANGWATCH_API_KEY}` },
        },
    },
})