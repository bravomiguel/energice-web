import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

import { checkActivePlungeSession, checkAuth, getUserById } from '@/lib/server-utils';
import prisma from '@/lib/db';

export default async function Home() {
  noStore();

  // auth check
  const session = await checkAuth();
  const user = await getUserById(session.user.id);

  // onboarded check
  if (!user?.firstName) redirect('/member-details');
  if (!user.isWaiverSigned) redirect('/waiver');

  // active plunge session check
  await checkActivePlungeSession(session.user.id);

  // callback redirect check
  if (user.authCallbackUrl) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { authCallbackUrl: null },
    });
    redirect(user.authCallbackUrl);
  }

  return <main className="h-screen">Home</main>;
}
