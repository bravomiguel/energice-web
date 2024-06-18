import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

import { checkPlungeSession, checkAuth, getUserById } from '@/lib/server-utils';
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

  // valid session check (i.e. paid for, and within time limit)
  const { data: plungeSession, status: plungeSessionStatus } =
    await checkPlungeSession(session.user.id);
  // redirect to session screen, if session is valid and has already started
  if (plungeSession && plungeSessionStatus === 'valid_started') {
    redirect(`/session/${plungeSession.id}`);
  } else if (plungeSession && plungeSessionStatus === 'valid_not_started') {
    // redirect to session unlock screen, if session not started yet
    redirect(`/session/${plungeSession.id}/unlock`);
  }

  if (user.authCallbackUrl) {
    // clear callback from db
    await prisma.user.update({
      where: { id: session.user.id },
      data: { authCallbackUrl: null },
    });
    redirect(user.authCallbackUrl);
  }

  // redirect to texas iron gym unit (as currently, it's the only unit)
  redirect(`/unit/${process.env.TEXAS_IRON_GYM_ID}`);

  return <main className="h-screen">Home</main>;
}
