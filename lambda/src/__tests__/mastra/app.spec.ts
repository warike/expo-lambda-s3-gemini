describe('mastra/app', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    it('constructs Mastra with basic agent, s3 vectors store, and observability exporter', async () => {
        const Mastra = jest.fn((cfg: any) => ({ __type: 'Mastra', ...cfg }));
        const Observability = jest.fn((cfg: any) => ({ __type: 'Observability', ...cfg }));

        jest.doMock('@mastra/core', () => ({
            Mastra,
        }));

        jest.doMock('@mastra/observability', () => ({
            Observability,
            SamplingStrategyType: {
                ALWAYS: 'ALWAYS',
            },
        }));

        jest.doMock('../../mastra/agent.js', () => ({
            basicAgent: { id: 'basic' },
        }));

        jest.doMock('../../mastra/vector.js', () => ({
            s3VectorsStore: { id: 's3vectors' },
        }));

        jest.doMock('../../mastra/observability.js', () => ({
            observabilityExporter: { id: 'otel-exporter' },
        }));

        const { mastra } = await import('../../mastra/app.js');

        expect(Observability).toHaveBeenCalledTimes(1);
        expect(Observability).toHaveBeenCalledWith(
            expect.objectContaining({
                configs: {
                    default: expect.objectContaining({
                        serviceName: 'warikeapp',
                        sampling: { type: 'ALWAYS' },
                        exporters: [{ id: 'otel-exporter' }],
                    }),
                },
            }),
        );

        expect(Mastra).toHaveBeenCalledTimes(1);
        expect(Mastra).toHaveBeenCalledWith(
            expect.objectContaining({
                agents: {
                    basic: { id: 'basic' },
                },
                vectors: {
                    s3vectors: { id: 's3vectors' },
                },
                observability: expect.objectContaining({ __type: 'Observability' }),
            }),
        );

        expect((mastra as any).__type).toBe('Mastra');
    });
});
