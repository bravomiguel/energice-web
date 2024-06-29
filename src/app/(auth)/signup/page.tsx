'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import H1 from '@/components/h1';
import SignupForm from '@/components/signup-form';

export default function Page() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  return (
    <main className="w-full">
      <H1 className="text-zinc-200 text-base font-medium mb-4">Sign Up</H1>
      <SignupForm />
      <div className="mt-3 text-xs text-center peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-200">
        {`By signing up, you agree to the `}
        <Link
          className="underline font-medium"
          target="_blank"
          href="https://koldup.com/#terms-of-service"
        >
          Terms of Service
        </Link>{' '}
        <br />
        {` and `}
        <Link
          className="underline font-medium"
          target="_blank"
          href="https://koldup.com/#privacy-policy"
        >
          Privacy Policy
        </Link>
      </div>
      <p className="mt-8 text-zinc-200 text-sm text-center">
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
