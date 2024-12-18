import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Chat Bot',
  description: 'AI Chat Bot powered by xAI',
  icons: {
    icon: '/bot-avatar.png',
    apple: '/bot-avatar.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
