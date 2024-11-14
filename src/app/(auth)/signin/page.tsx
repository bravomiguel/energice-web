import Link from 'next/link';

import H1 from '@/components/h1';
import SigninForm from '@/components/forms/signin-form';

export default function Page() {
  return (
    <main className="w-full">
      <SigninForm />
      <div className="mt-6 gap-3 flex flex-col items-center justify-center text-zinc-200 text-sm text-center">
        <p>
          No account yet?{' '}
          <Link
            href={'/signup'}
            className="font-medium underline text-sm"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
