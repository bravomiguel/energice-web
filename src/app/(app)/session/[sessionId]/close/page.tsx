import { unstable_noStore as noStore } from 'next/cache';
import { Session } from '@prisma/client';
import { redirect } from 'next/navigation';

import { getSessionById } from '@/lib/server-utils';
import { getTimeDiffSecs } from '@/lib/utils';
import CloseLidDisplay from '@/components/close-lid-display';

export default async function Page({
  params: { sessionId },
}: {
  params: { sessionId: Session['id'] };
}) {
  noStore();
  const plungeSession = await getSessionById(sessionId);

  if (!plungeSession?.sessionEnd) redirect(`/session/${sessionId}/success`);

  const now = new Date();
  const closeLidDeadline = new Date(
    plungeSession.sessionEnd.getTime() + 91 * 1000,
  );
  const closeSecsLeft = getTimeDiffSecs(now, closeLidDeadline);

  if (!closeSecsLeft) redirect(`/session/${sessionId}/success`);

  return (
    <main className="relative flex-1 flex flex-col gap-6">
      <CloseLidDisplay sessionId={sessionId} closeSecs={closeSecsLeft} />
    </main>
  );
}
