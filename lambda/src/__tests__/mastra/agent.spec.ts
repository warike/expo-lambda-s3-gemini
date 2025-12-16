describe('mastra/agent', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    it('constructs basicAgent with rag_system_prompt, languageModel, and queryTool', async () => {
        const Agent = jest.fn((cfg: any) => ({ __type: 'Agent', ...cfg }));

        jest.doMock('@mastra/core/agent', () => ({
            Agent,
        }));

        jest.doMock('../../mastra/prompt.js', () => ({
            rag_system_prompt: 'RAG_PROMPT',
        }));

        jest.doMock('../../mastra/model.js', () => ({
            languageModel: { id: 'mock-model' },
        }));

        jest.doMock('../../mastra/tools.js', () => ({
            queryTool: { id: 'mock-query-tool' },
            weatherTool: { id: 'mock-weather-tool' },
            gddTool: { id: 'mock-gdd-tool' },
            dataTool: { id: 'mock-data-tool' },
        }));

        const { basicAgent } = await import('../../mastra/agent.js');

        expect(Agent).toHaveBeenCalledTimes(1);
        expect(Agent).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'basic',
                name: 'basic',
                instructions: [
                    {
                        role: 'system',
                        content: 'RAG_PROMPT',
                    },
                ],
                model: { id: 'mock-model' },
                tools: {
                    queryTool: { id: 'mock-query-tool' },
                    weatherTool: { id: 'mock-weather-tool' },
                    gddTool: { id: 'mock-gdd-tool' },
                    dataTool: { id: 'mock-data-tool' },
                },
            }),
        );

        expect((basicAgent as any).__type).toBe('Agent');
        expect((basicAgent as any).id).toBe('basic');
    });
});
