import { stepCountIs } from "ai";
import { IngestData } from "./app";
import { mastra } from "./mastra";
import logger from "./logger";

export const QueryAgent = async () => {
    try {
        const query = "Why do I have to specify the month of the year that rain starts?"
        const agent = await mastra.getAgent("basic");
        const result = await agent.generate(query, {
            stopWhen: stepCountIs(5),
            modelSettings: {
                temperature: 0.0,
                topK: 5,
            },
        });
        logger.info(result.text);
    } catch (error) {
        logger.error(error);
    }

}


(async () => {
    await IngestData();
    await QueryAgent();
})();