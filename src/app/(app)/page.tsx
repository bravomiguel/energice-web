import { redirect } from 'next/navigation';

import {
  checkPlungeSession,
  checkAuth,
  getOrCreateProfileById,
} from '@/lib/server-utils';
import SignOutBtn from '@/components/buttons/sign-out-btn';
import DeleteAccountBtn from '@/components/buttons/delete-account-btn';

export default async function Home() {
  const user = await checkAuth();
  const profile = await getOrCreateProfileById(user.id);

  // onboarded check
  // if (!profile?.name) redirect('/member-details');
  // if (!profile.isWaiverSigned) redirect('/waiver');

  // valid session check (i.e. paid for, and within time limit)
  const { data: plungeSession, status: plungeSessionStatus } =
    await checkPlungeSession(user.id);
  // redirect to session screen, if session is valid and has already started
  if (plungeSession && plungeSessionStatus === 'valid_started') {
    redirect(`/session/${plungeSession.id}`);
  } 
  
  // redirect to profile (currently, no need for home screen)
  redirect('/profile');

  return (
    <main className="h-screen">
      <SignOutBtn />
      <DeleteAccountBtn />
    </main>
  );
}
