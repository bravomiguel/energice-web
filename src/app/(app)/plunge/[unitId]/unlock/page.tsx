import { unstable_noStore as noStore } from 'next/cache';
import { Unit } from '@prisma/client';

import { checkActivePlungeSession, checkAuth } from '@/lib/server-utils';
import { createActiveSession } from '@/actions/actions';
import H1 from '@/components/h1';
import { getTimeDiffSecs } from '@/lib/utils';
import UnlockDisplay from '@/components/unlock-display';
import { redirect } from 'next/navigation';

export default async function Page({
  params: { unitId },
}: {
  params: { unitId: Unit['id'] };
}) {
  noStore();
  // auth check
  const session = await checkAuth();

  // paid check
  // redirected unless they've paid, within last 10-15 mins

  // session active check
  const activePlungeSession = await checkActivePlungeSession(session.user.id);
  if (activePlungeSession.status === 'started')
    redirect(`/session/${activePlungeSession.data?.id}`);
  if (activePlungeSession.status === 'active') {
    if (activePlungeSession.data?.unitId !== unitId)
      redirect(`/plunge/${activePlungeSession.data?.unitId}/unlock`);
  }
  if (activePlungeSession.status === 'no_active') redirect(`/`);
  if (!activePlungeSession.data) redirect('/');

  const sessionData = activePlungeSession.data;
  const accessCode = activePlungeSession.data?.accessCode ?? null;

  // console.log({ activePlungeSession });
  // console.log({ sessionData });

  // calcs to deal with expiry countdown
  const now = new Date();
  const endsAt = sessionData?.accessCodeEndsAt
    ? new Date(sessionData?.accessCodeEndsAt)
    : null;
  const secsLeft = getTimeDiffSecs(now, endsAt);

  return (
    <main className="flex-1 flex flex-col gap-10">
      <H1>Unlock Plunge</H1>
      <UnlockDisplay
        className="flex-1 flex flex-col gap-10"
        code={accessCode}
        activeSessionId={sessionData.id}
        secsLeft={secsLeft}
        unitId={unitId}
      />
    </main>
  );
}
