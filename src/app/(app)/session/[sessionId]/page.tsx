import { unstable_noStore as noStore } from 'next/cache';
import { Session } from '@prisma/client';

import H1 from '@/components/h1';
import {
  checkActivePlungeSession,
  checkAuth,
  getSessionById,
} from '@/lib/server-utils';
import { redirect } from 'next/navigation';
import SessionDisplay from '@/components/session-display';
import { getTimeDiffSecs } from '@/lib/utils';

export default async function Page({
  params: { sessionId },
}: {
  params: { sessionId: Session['id'] };
}) {
  noStore();

  // auth check
  const session = await checkAuth();

  // paid check
  // redirected unless they've paid, within last 10-15 mins

  // session active check
  const activePlungeSession = await checkActivePlungeSession(session.user.id);
  if (activePlungeSession.status === 'started') {
    if (activePlungeSession.data?.id !== sessionId)
      redirect(`/session/${activePlungeSession.data?.id}`);
  }
  if (activePlungeSession.status === 'active') {
    redirect(`/plunge/${activePlungeSession.data?.unitId}/unlock`);
  }
  if (activePlungeSession.status === 'no_active') redirect(`/`);
  if (!activePlungeSession.data || !activePlungeSession.data.sessionStart)
    redirect('/');

  // calculate session seconds left, before passing it to client
  const now = new Date();
  const sessionEnd = new Date(
    activePlungeSession.data.sessionStart.getTime() + (10 * 60 * 1000) + (3 * 1000),
  );
  const sessionSecsLeft = getTimeDiffSecs(now, sessionEnd);

  if (!sessionSecsLeft) redirect('/');

  return (
    <main className="relative flex-1 flex flex-col gap-6">
      <SessionDisplay
        sessionData={activePlungeSession.data}
        sessionSecs={sessionSecsLeft}
        className="flex-1 flex flex-col items-center gap-10"
      />
    </main>
  );
}
