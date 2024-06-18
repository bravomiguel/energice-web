import { unstable_noStore as noStore } from 'next/cache';
import { Session, Unit } from '@prisma/client';

import { checkAuth, checkPlungeSession } from '@/lib/server-utils';
import H1 from '@/components/h1';
import { getTimeDiffSecs } from '@/lib/utils';
import UnlockDisplay from '@/components/unlock-display';
import { redirect } from 'next/navigation';
import AutoUnlock from '@/components/auto-unlock';

export default async function Page({
  params: { sessionId },
}: {
  params: { sessionId: Session['id'] };
}) {
  noStore();
  // auth check
  const session = await checkAuth();

  // valid session check (i.e. paid for, and within time limit)
  const { data: plungeSession, status: plungeSessionStatus } =
    await checkPlungeSession(session.user.id);
  // redirect to home screen, if no valid session
  if (!plungeSession) redirect('/');
  // redirect to session screen, if session is valid and has already started
  if (plungeSessionStatus === 'valid_started') {
    redirect(`/session/${plungeSession.id}`);
  } else if (plungeSessionStatus === 'valid_not_started') {
    // redirect to correct session unlock screen, if session not started yet
    if (plungeSession.id !== sessionId)
      redirect(`/session/${plungeSession.id}/unlock`);
  }

  // console.log({ plungeSession });

  // calcs to deal with expiry countdown
  // const now = new Date();
  // const endsAt = plungeSession?.accessCodeEndsAt
  //   ? new Date(plungeSession?.accessCodeEndsAt)
  //   : null;
  // const codeSecsLeft = getTimeDiffSecs(now, endsAt);

  return (
    <main className="flex-1 flex flex-col gap-10">
      <AutoUnlock
        className="flex-1 flex flex-col gap-10"
        unitId={plungeSession.unitId}
        sessionId={sessionId}
      />
      {/* <UnlockDisplay
        className="flex-1 flex flex-col gap-10"
        code={plungeSession?.accessCode ?? null}
        activeSessionId={plungeSession.id}
        secsLeft={codeSecsLeft}
        unitId={plungeSession.unitId}
      /> */}
    </main>
  );
}
