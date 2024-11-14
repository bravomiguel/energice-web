import Link from 'next/link';
import { CircleCheck } from 'lucide-react';

import SignupForm from '@/components/forms/signup-form';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; confirmError?: string }>;
}) {
  const params = await searchParams;
  const signupSuccess = params.success === 'true';

  return (
    <main className="w-full">
      {signupSuccess && (
        <div className="flex gap-2 justify-center items-center font-semibold text-primary mb-6 text-zinc-200">
          <CircleCheck className="h-6 w-6" />
          <p className="text-sm">
            Please check your email for a verification link.
          </p>
        </div>
      )}

      <SignupForm />

      <div className="mt-3 text-xs text-center peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-200/70">
        {`By using the app, you agree to the `} <br />
        <Link
          className="underline font-medium"
          target="_blank"
          href="https://koldup.com/#terms-of-service"
        >
          Terms of Service
        </Link>
        {` and `}
        <Link
          className="underline font-medium"
          target="_blank"
          href="https://koldup.com/#privacy-policy"
        >
          Privacy Policy
        </Link>
      </div>

      <p className="mt-6 text-zinc-200 text-sm text-center">
        Already have an account?{' '}
        <Link href={'/signin'} className="font-medium underline text-sm">
          Sign in
        </Link>
      </p>
    </main>
  );
}