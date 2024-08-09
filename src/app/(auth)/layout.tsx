'use client';

import { Suspense } from 'react';

import H1 from '@/components/h1';
import LogoFullText from '@/components/logo-full-text';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5 justify-center items-center min-h-screen w-screen bg-custom-gradient px-6">
      <div>
        <LogoFullText />
        <p className="text-center mb-5 font-bold text-indigo-900 text-2xl">
          Take the plunge.
        </p>
      </div>
      <Suspense>
        <div className="w-full max-w-md">{children}</div>
      </Suspense>
    </div>
  );
}
