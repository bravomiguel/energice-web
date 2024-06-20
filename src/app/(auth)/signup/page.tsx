'use client';

import H1 from '@/components/h1';
import SignupForm from '@/components/signup-form';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  return (
    <main className="w-full">
      <H1 className="text-zinc-200 text-lg font-medium mb-4">Sign Up</H1>
      <SignupForm />
      <p className="mt-6 text-zinc-200 text-sm text-center">
        Already have an account?{' '}
        <Link
          href={
            callbackUrl
              ? `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
              : '/signin'
          }
          className="font-medium underline text-sm"
        >
          Sign in
        </Link>
      </p>
    </main>
  );
}
