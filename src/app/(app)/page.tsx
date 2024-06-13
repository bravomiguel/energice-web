import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

import {
  checkActivePlungeSession,
  checkAuth,
  getUserById,
} from '@/lib/server-utils';
import prisma from '@/lib/db';

export default async function Home() {
  noStore();

  // auth check
  const session = await checkAuth();
  const user = await getUserById(session.user.id);

  // onboarded check
  // redirect to email confirmation page, if user hasn't confirmed email
  if (!user?.firstName) redirect('/member-details');
  if (!user.isWaiverSigned) redirect('/waiver');

  // active plunge session check
  const activePlungeSession = await checkActivePlungeSession(session.user.id);
  if (activePlungeSession.status === 'started') {
    redirect(`/session/${activePlungeSession.data?.id}`);
  } else if (activePlungeSession.status === 'active') {
    redirect(`/plunge/${activePlungeSession.data?.unitId}/unlock`);
  }

  // callback redirect check
  if (user.authCallbackUrl) {
    // clear callback from db
    await prisma.user.update({
      where: { id: session.user.id },
      data: { authCallbackUrl: null },
    });
    redirect(user.authCallbackUrl);
  }

  return <main className="h-screen">Home</main>;
}
