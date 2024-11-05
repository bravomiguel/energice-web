import Link from 'next/link';

import H1 from '@/components/h1';
import SignupForm from '@/components/signup-form';

export default function Page() {
  return (
    <main className="w-full">
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
        <Link
          href={'/signin'}
          className="font-medium underline text-sm"
        >
          Sign in
        </Link>
      </p>
    </main>
  );
}
