import H1 from '@/components/h1';
import SessionEndContinueBtn from '@/components/session-end-continue-btn';
import Subtitle from '@/components/subtitle';
import { getSessionById } from '@/lib/server-utils';
import { formatSecsToMins } from '@/lib/utils';
import { Session } from '@prisma/client';

export default async function Page({
  params: { sessionId },
}: {
  params: { sessionId: Session['id'] };
}) {
  const session = await getSessionById(sessionId);

  return (
    <main className="relative flex-1 flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center gap-6 w-[250px] mx-auto text-center">
        <H1>Total plunge time</H1>
        <div className="relative rounded-md border-8 border-green-koldup bg-transparent text-center p-5 h-24 flex items-center justify-center text-5xl font-semibold w-full">
          {!session?.totalPlungeSecs
            ? '🎉🎉🎉'
            : formatSecsToMins(session.totalPlungeSecs)}
        </div>
        <Subtitle className="text-2xl text-zinc-900 font-medium">
          Well done!
        </Subtitle>
        <Subtitle className="w-[180px]">
          Enjoy feeling great for the rest of the day 🚀
        </Subtitle>
      </div>
      <SessionEndContinueBtn />
    </main>
  );
}
