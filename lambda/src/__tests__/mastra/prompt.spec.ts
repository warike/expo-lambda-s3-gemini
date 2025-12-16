import { rag_system_prompt } from '../../mastra/prompt.js';

describe('mastra/prompt', () => {
    it('includes required placeholders and sections', () => {
        expect(rag_system_prompt).toContain('CORE RULES:');
        expect(rag_system_prompt).toContain('OUTPUT STYLE:');

        // Required template placeholders
        expect(rag_system_prompt).toContain('{context}');
        expect(rag_system_prompt).toContain('{query}');

        // Tool references
        expect(rag_system_prompt).toContain('dataTool');
        expect(rag_system_prompt).toContain('weatherTool');
        expect(rag_system_prompt).toContain('gddTool');

        // Expected sections
        expect(rag_system_prompt).toContain('CONTEXT:');
        expect(rag_system_prompt).toContain('QUERY:');
        expect(rag_system_prompt).toContain('ANSWER:');

        // Example sections
        expect(rag_system_prompt).toContain('EXAMPLE 1:');
        expect(rag_system_prompt).toContain('EXAMPLE 2:');
    });
});
