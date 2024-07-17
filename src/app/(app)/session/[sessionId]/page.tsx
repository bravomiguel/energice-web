import { unstable_noStore as noStore } from 'next/cache';
import { Session } from '@prisma/client';

import { checkPlungeSession, checkAuth } from '@/lib/server-utils';
import { redirect } from 'next/navigation';
import SessionDisplay from '@/components/session-display';
import { getTimeDiffSecs } from '@/lib/utils';
import { SESSION_MAX_TIME_SECS } from '@/lib/constants';

export default async function Page({
  params: { sessionId },
}: {
  params: { sessionId: Session['id'] };
}) {
  noStore();

  // auth check
  const session = await checkAuth();

  // valid session check (i.e. paid for / used credit, and within time limit)
  const { data: plungeSession, status: plungeSessionStatus } =
    await checkPlungeSession(session.user.id);
  // redirect to home screen, if no valid session
  if (!plungeSession || !plungeSession.sessionStart) {
    redirect('/');
  }
  // redirect to correct session screen, if session is valid and has already started
  if (plungeSessionStatus === 'valid_started') {
    if (plungeSession.id !== sessionId)
      redirect(`/session/${plungeSession.id}`);
  } else if (plungeSessionStatus === 'valid_not_started') {
    // redirect to session unlock screen, if session not started yet
    redirect(`/session/${plungeSession.id}/unlock`);
  }

  // calculate session seconds left, before passing it to client (put this into session context?)
  const now = new Date();
  const sessionEnd = new Date(
    plungeSession.sessionStart.getTime() + SESSION_MAX_TIME_SECS * 1000 + 8 * 1000,
  );
  const sessionSecsLeft = getTimeDiffSecs(now, sessionEnd);

  if (!sessionSecsLeft) redirect('/');

  return (
    <main className="relative flex-1 flex flex-col gap-6">
      <SessionDisplay
        sessionId={sessionId}
        plungeTimerSecs={plungeSession.plungeTimerSecs}
        sessionSecs={sessionSecsLeft}
        className="flex-1 flex flex-col items-center gap-10"
      />
    </main>
  );
}
