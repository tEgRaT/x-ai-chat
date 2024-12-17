import './globals.css';

export const metadata = {
  title: 'AI Chat Bot',
  description: 'AI Chat Bot powered by xAI',
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
