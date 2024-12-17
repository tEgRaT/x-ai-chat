# AI Chat Bot

A modern, responsive AI chat application built with Next.js, TypeScript, and xAI's Grok model. Features a WhatsApp/Telegram-like interface with support for markdown rendering and real-time message streaming.

## Features

- 🤖 Powered by xAI's Grok model
- 💻 Modern, responsive UI similar to popular chat apps
- ✨ Real-time message streaming
- 📝 Markdown support for bot responses
- 🌙 Dark mode interface
- ⌨️ Multi-line input support
- 🔄 Auto-scrolling chat
- 📱 Mobile-friendly design

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Markdown:** react-markdown with remark-gfm
- **Icons:** react-icons
- **AI Integration:** xAI API

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- xAI API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/tEgRaT/x-ai-chat.git
cd ai-chatbot
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env.local` file in the root directory:

```
env
XAI_API_KEY=your_xai_api_key_here
BASE_URL=https://api.x.ai/v1
```

4. Start the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ai-chatbot/
├── src/
│ ├── app/
│ │ ├── api/
│ │ │ └── chat/
│ │ │ └── route.ts # API endpoint for chat
│ │ ├── globals.css # Global styles
│ │ ├── layout.tsx # Root layout
│ │ └── page.tsx # Main chat interface
│ ├── components/
│ │ └── ChatMessage.tsx # Chat message component
│ └── types/
│ └── chat.ts # TypeScript interfaces
├── public/
│ ├── bot-avatar.png # Bot avatar image
│ └── user-avatar.png # User avatar image
├── .env.local # Environment variables
├── tailwind.config.js # Tailwind configuration
├── postcss.config.js # PostCSS configuration
└── package.json
```

## Features in Detail

### Message Formatting

- User messages appear on the right with indigo background
- Bot messages appear on the left with dark background
- Markdown rendering for bot responses including:
  - Code blocks with syntax highlighting
  - Lists (ordered and unordered)
  - Links
  - Bold and italic text
  - Tables
  - Blockquotes

### UI/UX Features

- Auto-expanding input field
- Send button transforms into loading spinner during API calls
- Smooth scrolling to latest messages
- Enter to send, Shift+Enter for new line
- Responsive design that works on all screen sizes
- Fixed header with bot status
- Fixed input area at bottom

## Environment Variables

- `XAI_API_KEY`: Your xAI API key
- `BASE_URL`: xAI API base URL (https://api.x.ai/v1)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

ISC License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

- xAI for providing the Grok model API
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
