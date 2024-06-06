import AuthForm from '@/components/auth-form';
import Link from 'next/link';

export default function Page () {
  return (
    <main className='w-full'>
      <AuthForm type={"signIn"} />
      <p className='mt-6 text-zinc-200 text-sm text-center'>
        No account yet?{' '}
        <Link href={'/signup'} className="font-medium underline text-sm">
          Sign up
        </Link>
      </p>
    </main>
  );
};
