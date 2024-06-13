import { unstable_noStore as noStore } from 'next/cache';
import { Session } from '@prisma/client';

import H1 from '@/components/h1';
import { checkActivePlungeSession, checkAuth } from '@/lib/server-utils';
import { redirect } from 'next/navigation';
import SessionDisplay from '@/components/session-display';

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
  // const activePlungeSession = await checkActivePlungeSession(session.user.id);
  // if (activePlungeSession.status === 'started') {
  //   if (activePlungeSession.data?.id !== sessionId)
  //     redirect(`/session/${activePlungeSession.data?.id}`);
  // }
  // if (activePlungeSession.status === 'active') {
  //   redirect(`/plunge/${activePlungeSession.data?.unitId}/unlock`);
  // }
  // if (activePlungeSession.status === 'no_active') redirect(`/`);
  // if (!activePlungeSession.data) redirect('/');

  // console.log({ activePlungeSession });

  return (
    <main className='flex-1 flex flex-col gap-10"'>
      <H1>Session</H1>
      <SessionDisplay className="flex-1 flex flex-col gap-10" />
    </main>
  );
}
