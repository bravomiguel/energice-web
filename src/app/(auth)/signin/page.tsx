'use client';

import { accessResetPassword } from '@/actions/actions';
import AuthForm from '@/components/auth-form';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  return (
    <main className="w-full">
      <AuthForm type={'signIn'} />
      <div className="mt-6 gap-3 flex flex-col items-center justify-center text-zinc-200 text-sm text-center">
        <p className="">
          No account yet?{' '}
          <Link
            href={
              callbackUrl
                ? `/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : '/signup'
            }
            className="font-medium underline text-sm"
          >
            Sign up
          </Link>
        </p>
        <button
          onClick={async () => await accessResetPassword()}
          className="font-medium underline text-sm"
        >
          Forgot password?
        </button>
      </div>
    </main>
  );
}
