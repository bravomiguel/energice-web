import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

export default async function Home() {
  noStore();

  const session = await auth();
  const email = session?.user?.email ?? undefined;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user?.firstName) redirect('/member-details');

  if (!user.isWaiverSigned) redirect('/waiver');

  return <main className="h-screen">Home</main>;
}
