import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

import EmailConfirmForm from '@/components/email-confirm-form';
import H1 from '@/components/h1';
import Subtitle from '@/components/subtitle';
import { checkAuth, getUserById } from '@/lib/server-utils';

export default async function Page() {
  noStore();

  // auth check
  const session = await checkAuth();
  const user = await getUserById(session.user.id);

  // onboarding check
  if (user?.isEmailConfirmed) redirect('/');

  return (
    <main className="relative flex-1 flex flex-col gap-6">
      <div className='flex flex-col gap-1'>
        <H1>Confirm your email</H1>
        <Subtitle>Request an email confirmation code, and enter it below</Subtitle>
      </div>
      <EmailConfirmForm />
    </main>
  );
}
