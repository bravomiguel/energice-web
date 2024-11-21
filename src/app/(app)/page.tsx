import { redirect } from 'next/navigation';

import {
  checkPlungeSession,
  checkAuth,
  getProfileById,
} from '@/lib/server-utils';
import SignOutBtn from '@/components/buttons/sign-out-btn';
import DeleteAccountBtn from '@/components/buttons/delete-account-btn';
import prisma from '@/lib/db';

export default async function Home() {
  const user = await checkAuth();
  const profile = await getProfileById(user.id);

  // onboarded check
  if (!profile?.name) redirect('/member-details');
  if (!profile.isWaiverSigned) redirect('/waiver');

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
  redirect('/profile');

  return (
    <main className="h-screen">
      <SignOutBtn />
      <DeleteAccountBtn />
    </main>
  );
}
