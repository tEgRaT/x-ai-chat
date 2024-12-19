import OpenAI from 'openai';
import { Message } from '@/types/chat';
import { NextResponse } from 'next/server';
import {
  ChatCompletionSystemMessageParam,
  ChatCompletionMessageParam,
} from 'openai/resources/chat';

const openai = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json();
    const lastMessage = messages[messages.length - 1];

    const systemMessage: ChatCompletionSystemMessageParam = {
      role: 'system',
      content:
        'You are Grok, a helpful assistant that can understand both text and images. When analyzing images, first describe what you see literally, then provide context or interpretation if relevant.',
    };

    let messageContent;
    if (lastMessage.image) {
      const base64Data = lastMessage.image.includes('base64,')
        ? lastMessage.image.split('base64,')[1]
        : lastMessage.image;

      const sizeInMB = (base64Data.length * 0.75) / (1024 * 1024);
      console.log('Image details:', {
        sizeInMB: sizeInMB.toFixed(2) + 'MB',
        startsWithJPEG: base64Data.startsWith('/9j/'),
        length: base64Data.length,
        imageType: lastMessage.image.substring(
          5,
          lastMessage.image.indexOf(';')
        ),
      });

      if (base64Data.length > 50000) {
        throw new Error(
          'Image is too large. Please try a smaller image or lower quality.'
        );
      }

      messageContent = [
        {
          type: 'image_url',
          image_url: {
            url: `data:image/jpeg;base64,${base64Data}`,
            detail: 'high',
          },
        },
        {
          type: 'text',
          text: lastMessage.content || "What's in this image?",
        },
      ];
    } else {
      messageContent = lastMessage.content;
    }

    const apiMessages: ChatCompletionMessageParam[] = [
      systemMessage,
      ...messages.slice(0, -1).map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: lastMessage.role, content: messageContent },
    ];

    console.log('Sending request to xAI with message structure:', {
      model: 'grok-vision-beta',
      messageCount: apiMessages.length,
      hasImage: !!lastMessage.image,
    });

    const completion = await openai.chat.completions.create({
      model: 'grok-vision-beta',
      messages: apiMessages,
      stream: false,
      temperature: 0.01,
    });

    if (!completion.choices[0]?.message?.content) {
      throw new Error('Invalid API response format');
    }

    console.log('API Response:', {
      status: 'success',
      messageLength: completion.choices[0].message.content.length,
      systemFingerprint: completion.system_fingerprint,
    });

    return NextResponse.json({
      message: completion.choices[0].message.content,
      system_fingerprint: completion.system_fingerprint,
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
