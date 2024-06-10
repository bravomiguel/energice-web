import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

import { checkAuth, getUserById } from '@/lib/server-utils';
import prisma from '@/lib/db';

export default async function Home() {
  noStore();
  const session = await checkAuth();
  const user = await getUserById(session.user.id);

  if (!user?.firstName) redirect('/member-details');

  if (!user.isWaiverSigned) redirect('/waiver');

  if (user.authCallbackUrl) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { authCallbackUrl: null },
    });
    redirect(user.authCallbackUrl);
  }

  return <main className="h-screen">Home</main>;
}
