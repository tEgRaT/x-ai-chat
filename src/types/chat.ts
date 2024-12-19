type MessageContent =
  | string
  | Array<{
      type: 'image_url' | 'text';
      image_url?: {
        url: string;
        detail: 'high' | 'low';
      };
      text?: string;
    }>;

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: MessageContent;
  image?: string;
}

export interface ChatResponse {
  message: string;
  error?: string;
}
