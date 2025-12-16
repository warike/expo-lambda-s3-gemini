import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { verifyToken } from '@clerk/backend';
import { convertToModelMessages, stepCountIs, streamText, tool, UIMessage } from 'ai';
import { z } from 'zod';

const client = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const SYSTEM_PROMPT = `You are a friendly, helpful, and versatile artificial intelligence assistant.

Your main goal is to help the user with any question or task they have, whether it’s:
- Answering general knowledge questions
- Helping with programming tasks
- Explaining concepts
- Having casual conversations
- Solving problems
- And much more

**Available tools:**
You have access to some tools that you can use WHEN RELEVANT:
- weather: To get weather information for a location
- convertFahrenheitToCelsius: To convert temperatures from Fahrenheit to Celsius

**Important:** Only use the tools when the user specifically asks about the weather or temperature conversions. For any other topic, respond directly with your knowledge.

Always respond clearly, concisely, and in the language the user writes to you in.`;

export async function POST(req: Request) {
    // Verify token
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
        });

        const { messages }: { messages: UIMessage[] } = await req.json();
        const result = await streamText({
            model: client.languageModel('gemini-2.5-flash'),
            messages: convertToModelMessages(messages),
            system: SYSTEM_PROMPT,
            stopWhen: stepCountIs(5),
            tools: {
                weather: tool({
                    description:
                        'Get the current weather in a specific location. Returns temperature in Fahrenheit. Only use this when the user explicitly asks about weather or climate conditions.',
                    parameters: z.object({
                        location: z.string().describe('The city or location to get the weather for'),
                    }),
                    execute: async ({ location }: { location: string }) => {
                        const temperature = Math.round(Math.random() * (90 - 32) + 32);
                        return {
                            location,
                            temperature,
                            unit: 'fahrenheit',
                        };
                    },
                }),
                convertFahrenheitToCelsius: tool({
                    description:
                        'Convert a temperature from Fahrenheit to Celsius. Use this when you need to convert temperature units.',
                    parameters: z.object({
                        temperature: z
                            .number()
                            .describe('The temperature in Fahrenheit to convert to Celsius'),
                    }),
                    execute: async ({ temperature }) => {
                        const celsius = Math.round((temperature - 32) * (5 / 9));
                        return {
                            celsius,
                            original_fahrenheit: temperature,
                        };
                    },
                }),
            },
            onError({ error }) {
                console.error(error);
            },
        });

        return result.toUIMessageStreamResponse({
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Encoding': 'none',
            },
        });
    } catch {
        return new Response('Invalid token', { status: 401 });
    }
}
