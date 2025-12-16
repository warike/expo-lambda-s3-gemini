describe('mastra/tool', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();

        process.env.AWS_S3_VECTORS_INDEX_NAME = 'test-index';
    });

    it('wires queryTool with s3 vector store name, index name, and embedding model', async () => {
        const createVectorQueryTool = jest.fn((cfg: any) => ({ ...cfg }));
        const mockEmbeddingModel = { id: 'mock-embedding' };

        jest.doMock('@mastra/rag', () => ({
            createVectorQueryTool,
        }));

        jest.doMock('../../mastra/model.js', () => ({
            embeddingModel: mockEmbeddingModel,
        }));

        jest.doMock('../../mastra/vector.js', () => ({
            S3VectorsStoreName: 's3vectors',
        }));

        const { queryTool } = await import('../../mastra/tools.js');

        expect(createVectorQueryTool).toHaveBeenCalledTimes(1);

        const cfg = createVectorQueryTool.mock.calls[0]?.[0];
        expect(cfg).toEqual(
            expect.objectContaining({
                id: 'tool_knowledgebase_s3vectors',
                vectorStoreName: 's3vectors',
                indexName: 'test-index',
                includeVectors: false,
                model: mockEmbeddingModel,
            }),
        );

        // Our mock returns the config object verbatim
        expect((queryTool as any).id).toBe('tool_knowledgebase_s3vectors');
    });
});
