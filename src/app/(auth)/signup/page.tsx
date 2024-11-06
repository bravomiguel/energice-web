import Link from 'next/link';

import SignupForm from '@/components/signup-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { IoMdMail } from "react-icons/io";
import { cn } from '@/lib/utils';

export default async function Page({
  searchParams,
}: {
  searchParams: { success?: boolean };
}) {
  const success = searchParams.success ?? false;

  return (
    <main className="w-full">
      {success && <SignupSuccess className='mb-5' />}

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

function SignupSuccess({ className }: { className?: string }) {
  return (
    <Alert className={cn('bg-indigo-100 text-zinc-700 pr-10 pt-5', className)}>
      <IoMdMail className="h-6 w-6 fill-indigo-800 -translate-y-1 -translate-x-0.5" />
      <div className="space-y-3">
        <AlertTitle>Thanks for signing up!</AlertTitle>
        <AlertDescription>
          Please check your email for a verification link.
        </AlertDescription>
      </div>
    </Alert>
  );
}
