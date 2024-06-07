import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { getUser } from '@/actions/actions';

export default async function Home() {
  noStore();
  const user = await getUser();

  if (!user?.firstName) redirect('/member-details');

  if (!user.isWaiverSigned) redirect('/waiver');

  return <main className="h-screen">Home</main>;
}
