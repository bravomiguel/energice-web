import Link from 'next/link';
import { CircleCheck } from 'lucide-react';

import SigninForm from '@/components/forms/signin-form';
import H1 from '@/components/h1';
import LogoTransparent from '@/components/logos/logo-transparent';
import Subtitle from '@/components/subtitle';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    success?: string;
    confirmError?: string;
    prelaunchCheckout?: string;
  }>;
}) {
  const params = await searchParams;
  const signupSuccess = params.success === 'true';
  const prelaunchCheckout = params.prelaunchCheckout === 'true';

  return (
    <main className="flex flex-col gap-5 justify-center items-center min-h-screen w-screen bg-custom-gradient px-6">
      <div className="w-full max-w-md flex flex-col gap-5 relative">
        <div className="flex flex-col items-center absolute top-0 -translate-y-full w-full">
          <LogoTransparent className="h-20 w-20" />
          <p className="text-center font-bold text-zinc-100 text-lg mb-8">
            ENERGICE
          </p>
        </div>

        {prelaunchCheckout ? (
          <div className='flex flex-col gap-2'>
            <H1 className="text-zinc-100 text-center flex flex-col">
              <span className="text-base font-semibold">Become a</span>
              <span className="text-2xl font-bold">Founding Member</span>
            </H1>
            <Subtitle className="text-zinc-100 text-base font-medium mb-4 text-center">
              Only 20 spots available!
            </Subtitle>
          </div>
        ) : (
          <H1 className="text-zinc-100 text-xl font-bold mb-4 text-center">
            Log in or create an account
          </H1>
        )}

        {signupSuccess && (
          <div className="flex gap-2 justify-center items-center font-semibold text-primary mb-6 text-zinc-200">
            <CircleCheck className="h-6 w-6" />
            <p className="text-sm">
              Please check your email for a verification link.
            </p>
          </div>
        )}

        <SigninForm prelaunchCheckout={prelaunchCheckout} />

        <div className="mt-3 text-xs text-center peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-200/70">
          {`By using the app, you agree to the `} <br />
          <Link
            className="underline font-medium"
            target="_blank"
            href="https://energicelife.com/#terms-of-service"
          >
            Terms of Service
          </Link>
          {` and `}
          <Link
            className="underline font-medium"
            target="_blank"
            href="https://energicelife.com/#privacy-policy"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </main>
  );
}
