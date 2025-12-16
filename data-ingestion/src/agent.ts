import { Agent } from '@mastra/core/agent';
import { rag_system_prompt } from './prompt.js';
import { languageModel } from './model.js';
import { queryTool } from './tool.js';

export const basicAgent = new Agent({
    id: "basic",
    name: "basic",
    instructions: [
        {
            role: "system", content: rag_system_prompt
        },
    ],
    model: languageModel,
    tools: [queryTool],
});