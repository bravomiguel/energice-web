import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

import EmailConfirmForm from '@/components/email-confirm-form';
import H1 from '@/components/h1';
import Subtitle from '@/components/subtitle';
import { checkAuth, getUserById } from '@/lib/server-utils';
import PasswordResetForm from '@/components/password-reset-form';

export default async function Page() {
  noStore();

  // auth check
  const session = await checkAuth();
  const user = await getUserById(session.user.id);

  // redirect to reset password page
  if (user?.email !== 'resetpassword@koldup.com') redirect('/');

  return (
    <main className="relative flex-1 flex flex-col gap-6">
      <PasswordResetForm />
    </main>
  );
}
