'use client';

import { useState, FormEvent, useRef, useEffect, ChangeEvent } from 'react';
import { Message } from '@/types/chat';
import ChatMessage from '@/components/ChatMessage';
import { IoSend, IoClose, IoImage } from 'react-icons/io5';
import Image from 'next/image';
import { compressImage } from '@/utils/imageUtils';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content:
        'You are Grok, a helpful assistant that can understand both text and images. You can answer questions about anything and analyze images when they are shared.',
    },
    {
      role: 'assistant',
      content:
        '你好，我是无所不知曹叫兽，你的AI助手。很开心和你聊天，我们可以聊任何事，或者你有任何问题需要帮助吗？\n\n' +
        "Hello, I am Professor Cao, your AI assistant who knows everything. I'm happy to chat with you! We can talk about anything, or do you have any questions that need help?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea as user types
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  };

  // Handle Enter key to submit, Shift+Enter for new line
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleImageSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert('Image size must be less than 20MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        try {
          const compressed = await compressImage(base64String);
          setSelectedImage(compressed);
        } catch (error) {
          console.error('Error compressing image:', error);
          alert('Failed to process image. Please try again.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      ...(selectedImage && { image: selectedImage }),
    };

    // Add user message
    setMessages((prev) => [...prev, userMessage]);

    // Add temporary "thinking" message
    const thinkingMessage: Message = {
      role: 'assistant',
      content: '🤔 Thinking...',
    };
    setMessages((prev) => [...prev, thinkingMessage]);

    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Replace thinking message with actual response
      setMessages((prev) => [
        ...prev.slice(0, -1), // Remove thinking message
        {
          role: 'assistant',
          content: data.message,
        },
      ]);
    } catch (error) {
      console.error('Error:', error);
      // Remove thinking message on error
      setMessages((prev) => prev.slice(0, -1));
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 text-gray-100 py-3 px-4 fixed top-0 w-full z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700">
            <Image
              src="/bot-avatar.png"
              alt="Bot Avatar"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold">AI Assistant</h1>
            <p className="text-xs text-gray-400">
              {isLoading ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
      </header>

      {/* Chat Messages Container */}
      <main className="flex-1 overflow-y-auto pt-20 pb-36">
        <div className="max-w-2xl mx-auto px-4 space-y-4">
          {messages.slice(1).map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Form - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 py-4 px-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto flex flex-col gap-2"
        >
          {selectedImage && (
            <div className="relative w-32 h-32">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
              >
                <IoClose className="text-white text-sm" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              ref={fileInputRef}
              className="hidden"
              id="image-input"
            />
            <label
              htmlFor="image-input"
              className="cursor-pointer p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <IoImage className="text-gray-400 text-xl" />
            </label>

            <div className="flex-1 relative flex items-center">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  adjustTextareaHeight();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a message"
                className="w-full resize-none px-4 py-2 max-h-[150px] rounded-2xl focus:outline-none text-sm bg-gray-700 text-gray-100 placeholder-gray-400 border-none pr-14 leading-6"
                disabled={isLoading}
                rows={1}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 w-9 h-9 flex items-center justify-center bg-emerald-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors"
              >
                <IoSend
                  className={`text-lg ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                {isLoading && (
                  <div className="absolute w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
