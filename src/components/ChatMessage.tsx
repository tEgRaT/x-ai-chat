import { Message } from '@/types/chat';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: Message;
}

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isThinking =
    message.role === 'assistant' && message.content === '🤔 Thinking...';

  // Helper function to get text content
  const getTextContent = (content: Message['content']): string => {
    if (typeof content === 'string') {
      return content;
    }
    if (Array.isArray(content)) {
      return content
        .filter((item) => item.type === 'text')
        .map((item) => item.text)
        .join('\n');
    }
    return '';
  };

  return (
    <div
      className={`flex items-end gap-2 mb-4 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gray-700">
        <Image
          src={isUser ? '/user-avatar.png' : '/bot-avatar.png'}
          alt={isUser ? 'User Avatar' : 'Bot Avatar'}
          width={32}
          height={32}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Message Bubble */}
      <div
        className={`relative max-w-[75%] px-4 py-2 ${
          isUser
            ? 'bg-indigo-600 text-white rounded-2xl rounded-br-none'
            : 'bg-gray-800 text-gray-100 rounded-2xl rounded-bl-none border border-gray-700'
        } ${isThinking ? 'thinking' : ''}`}
      >
        {/* Display image if present */}
        {message.image && (
          <div className="mb-2">
            <img
              src={message.image}
              alt="Shared image"
              className="max-w-full h-auto rounded-lg"
              onError={(e) => {
                console.error('Image failed to load');
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {isUser ? (
          <p className="whitespace-pre-wrap break-words text-sm">
            {getTextContent(message.content)}
          </p>
        ) : (
          <div className="markdown-body text-sm">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className="whitespace-pre-wrap break-words mb-4 last:mb-0">
                    {children}
                  </p>
                ),
                code: ({
                  node,
                  inline,
                  className,
                  children,
                  ...props
                }: CodeProps) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline ? (
                    <pre className="bg-gray-900 p-3 rounded-lg overflow-x-auto">
                      <code className={match ? className : ''} {...props}>
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code
                      className="bg-gray-900 px-1 py-0.5 rounded text-sm"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-4 last:mb-0">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-4 last:mb-0">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="mb-1">{children}</li>,
                a: ({ children, href }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {getTextContent(message.content)}
            </ReactMarkdown>
          </div>
        )}

        {/* Message Tail */}
        <div
          className={`absolute bottom-0 ${
            isUser ? '-right-2' : '-left-2'
          } w-2 h-2 ${isUser ? 'bg-indigo-600' : 'bg-gray-800'} ${
            !isUser && 'border-b border-r border-gray-700'
          }`}
          style={{
            clipPath: isUser
              ? 'polygon(100% 0, 0 0, 100% 100%)'
              : 'polygon(0 0, 100% 0, 0 100%)',
          }}
        />
      </div>
    </div>
  );
}
