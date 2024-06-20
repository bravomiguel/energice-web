import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

import DeleteAccountBtn from '@/components/delete-account-btn';
import SignOutBtn from '@/components/sign-out-btn';
import StartPlungeBtn from '@/components/start-plunge-btn';
import { checkAuth, getUserById } from '@/lib/server-utils';
import H1 from '@/components/h1';

export default async function Page() {
  noStore();

  // auth check
  const session = await checkAuth();
  const user = await getUserById(session.user.id);

  // redirect to reset password page, if required
  if (user?.email === 'resetpassword@koldup.com') redirect('/reset-password');

  // onboarded check
  // if (!user?.isEmailConfirmed) redirect('/confirm-email');
  // if (!user?.firstName) redirect('/member-details');
  // if (!user.isWaiverSigned) redirect('/waiver');

  return (
    <main className="relative flex-1 flex flex-col gap-6">
      <H1>Hey, </H1>
      <div className='flex flex-col w-full gap-3'>
        <StartPlungeBtn />
        <SignOutBtn />
        <DeleteAccountBtn />
      </div>
    </main>
  );
}
