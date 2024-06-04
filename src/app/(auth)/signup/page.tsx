import AuthForm from '@/components/auth-form';
import Link from 'next/link';

const Page = () => {
  return (
    <main className='w-full'>
      <AuthForm type="signUp" />
      <p className="mt-6 text-zinc-200 text-sm text-center">
        Already have an account?{' '}
        <Link href={'/signin'} className="font-medium underline text-sm">
          Sign in
        </Link>
      </p>
    </main>
  );
};

export default Page;
