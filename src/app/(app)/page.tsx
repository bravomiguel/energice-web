import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

import { checkPlungeSession, checkAuth, getUserById } from '@/lib/server-utils';
import { isUserOver18 } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import SignOutBtn from '@/components/sign-out-btn';

export default async function Home() {
  noStore();

  // auth check
  // const session = await checkAuth();
  // const user = await getUserById(session.user.id);
  // const isOver18 = isUserOver18(user?.dob ?? null);

  // onboarded check
  // if (!user?.isEmailConfirmed) redirect('/welcome');
  // if (!user?.firstName) redirect('/member-details');
  // if (!user.isWaiverSigned && isOver18) redirect('/waiver');
  // if (!user.isGWaiverSigned && !isOver18) redirect('/guardian-waiver');

  // valid session check (i.e. paid for, and within time limit)
  // const { data: plungeSession, status: plungeSessionStatus } =
  //   await checkPlungeSession(session.user.id);
  // redirect to session screen, if session is valid and has already started
  // if (plungeSession && plungeSessionStatus === 'valid_started') {
  //   redirect(`/session/${plungeSession.id}`);
  // } else if (plungeSession && plungeSessionStatus === 'valid_not_started') {
  //   // redirect to session unlock screen, if session not started yet
  //   redirect(`/session/${plungeSession.id}/unlock`);
  // }

  // redirect to profile (currently, no need for home screen)
  // redirect('/profile');

  return (
    <main className="h-screen">
      <SignOutBtn />
    </main>
  );
}
