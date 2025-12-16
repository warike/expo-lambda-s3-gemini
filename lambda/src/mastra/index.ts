import { mastra } from './app.js';
import { UIMessage, stepCountIs } from 'ai';
import { pipeline } from 'node:stream/promises';


export const runAgent = async (messages: UIMessage[], responseStream: awslambda.HttpResponseStream) => {
    const agent = mastra.getAgent("basic");
    const result = await agent.stream(messages, {
        stopWhen: stepCountIs(5),
        modelSettings: {
            temperature: 0.0,
            topK: 3,
        },
    });
    const sseResponse = result.aisdk.v5.toUIMessageStreamResponse({ sendReasoning: false });
    await pipeline(sseResponse.body!, responseStream);
}