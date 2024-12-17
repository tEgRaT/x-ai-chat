import OpenAI from 'openai';
import { Message } from '@/types/chat';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    const completion = await openai.chat.completions.create({
      model: 'grok-beta',
      messages: messages,
      stream: false,
      temperature: 0.7,
    });

    return NextResponse.json({
      message: completion.choices[0].message.content,
      system_fingerprint: completion.system_fingerprint,
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
