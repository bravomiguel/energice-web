import { unstable_noStore as noStore } from 'next/cache';
import { Session } from '@prisma/client';

import { checkAuth, checkPlungeSession } from '@/lib/server-utils';
import { redirect } from 'next/navigation';
import AutoUnlock from '@/components/auto-unlock';

export default async function Page({
  params: { sessionId },
}: {
  params: { sessionId: Session['id'] };
}) {
  noStore();
  // auth check
  const user = await checkAuth();

  // valid session check (i.e. paid for / used credit, and within time limit)
  const { data: plungeSession, status: plungeSessionStatus } =
    await checkPlungeSession(user.id);
  // redirect to home screen, if no valid session
  if (!plungeSession) redirect('/');
  // redirect to session screen, if session is valid and has already started
  if (plungeSessionStatus === 'valid_started') {
    redirect(`/session/${plungeSession.id}`);
  } 

  return (
    <main className="flex-1 flex flex-col gap-3">
      <AutoUnlock
        className="flex-1 flex flex-col gap-10"
        unitId={plungeSession.unitId}
        sessionId={sessionId}
      />
    </main>
  );
}
