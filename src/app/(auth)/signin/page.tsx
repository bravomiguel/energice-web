'use client';

import AuthForm from '@/components/auth-form';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  return (
    <main className="w-full">
      <AuthForm type={'signIn'} />
      <p className="mt-6 text-zinc-200 text-sm text-center">
        No account yet?{' '}
        <Link
          href={callbackUrl ? `/signup?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/signup'}
          className="font-medium underline text-sm"
        >
          Sign up
        </Link>
      </p>
    </main>
  );
}
