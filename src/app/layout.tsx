import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

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
        className={`${inter.className} text-sm text-zinc-900 bg-[#e5e8ec] min-h-screen sm:flex sm:items-center sm:justify-center sm:bg-gray-400 px-4`}
      >
        <p className="hidden sm:block text-lg font-semibold">
          App only available on mobile
        </p>
        <div className="sm:hidden">{children}</div>
      </body>
    </html>
  );
}
