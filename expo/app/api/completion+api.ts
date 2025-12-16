import { streamText } from 'ai';
import { google, LanguageModel } from '@/constants/Models';

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        const result = streamText({
            model: google.languageModel(LanguageModel.GEMINI_2_5_FLASH),
            system: 'You are a helpful assistant that can answer questions and help with tasks.',
            prompt,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
