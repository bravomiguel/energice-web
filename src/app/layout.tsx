import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import './globals.css';
import LogoTransparent from '@/components/logo-transparent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KoldUp',
  description: 'Take the plunge.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} text-base text-zinc-900 bg-zinc-100 min-h-screen sm:flex sm:flex-col sm:gap-4 sm:items-center sm:justify-center sm:bg-custom-gradient sm:text-zinc-200`}
      >
        <LogoTransparent className="hidden sm:block" />
        <p className="hidden sm:block text-lg font-semibold">
          App only available on mobile
        </p>
        <div className="sm:hidden">
          <SessionProvider>{children}</SessionProvider>
        </div>
      </body>
    </html>
  );
}
