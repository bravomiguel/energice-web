import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Energice',
  description: 'Take the plunge.',
};

export const viewport: Viewport = {
  themeColor: '#8c52ff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} text-base text-zinc-900 bg-zinc-100 min-h-screen sm:flex sm:flex-col sm:gap-4 sm:items-center sm:justify-center`}
      >
        {children}
      </body>
    </html>
  );
}
