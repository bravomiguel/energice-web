'use client';

import H1 from '@/components/h1';
import LogoFullText from '@/components/logo-full-text';
import { Suspense } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5 justify-center items-center min-h-screen w-screen bg-custom-gradient px-6">
      <div className="flex flex-col gap-3">
        <LogoFullText />
        <H1 className="text-center mb-5 font-bold text-indigo-900">
          Take the plunge.
        </H1>
      </div>
      <Suspense>{children}</Suspense>
    </div>
  );
}
