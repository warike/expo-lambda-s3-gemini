import './polyfills.js';
import { checkAccess } from './auth.js';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { runAgent } from './mastra/index.js';


export const handler = awslambda.streamifyResponse<APIGatewayProxyEventV2>(
    async (event: APIGatewayProxyEventV2, responseStream: awslambda.HttpResponseStream) => {

        responseStream.setContentType('text/plain; charset=utf-8');

        if (!await checkAccess(event)) {
            responseStream.write('Unauthorized');
            responseStream.end();
            return;
        };

        if (event.rawPath !== '/api/chat') {
            const httpResponseMetadata = {
                statusCode: 404,
                statusMessage: "Not Found",
                headers: {},
            };
            responseStream = awslambda.HttpResponseStream.from(responseStream, httpResponseMetadata);
            responseStream.write('Not Found');
            responseStream.end();
            return;
        }

        try {
            const httpResponseMetadata = {
                statusCode: 200,
                statusMessage: "OK",
                headers: {},
            };
            responseStream = awslambda.HttpResponseStream.from(responseStream, httpResponseMetadata);
            // Parse request body
            if (event.body) {
                const body = JSON.parse(event.body);
                const { messages } = body;
                await runAgent(messages, responseStream);
            }
        } catch (error) {
            console.error(`Error in handler:`);
            console.error(error);
        } finally {
            responseStream.end();
        }
    }
);