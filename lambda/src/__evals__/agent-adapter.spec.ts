import { type AgentAdapter, AgentRole, AgentReturnTypes } from "@langwatch/scenario";
import { mastra } from "../mastra/app.js";

export const basicAgent: AgentAdapter = {
    role: AgentRole.AGENT,
    call: async (input) => {
        const basic = mastra.getAgent("basic");
        const result = await basic.generate(input.messages);
        return result.response.messages as unknown as AgentReturnTypes;
    },
};