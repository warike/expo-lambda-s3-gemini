// Polyfill for local development where the 'awslambda' global is not available.
// This ensures the code can run locally without crashing on 'ReferenceError: awslambda is not defined'.

if (typeof (globalThis as any).awslambda === 'undefined') {
    (globalThis as any).awslambda = {
        streamifyResponse: (handler: any) => handler
    };
}
