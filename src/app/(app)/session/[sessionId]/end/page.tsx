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
      <div className="flex-1 flex flex-col justify-center items-center gap-6 w-[270px] mx-auto text-center">
        <div className='space-y-4 w-full'>
          <H1>Total plunge time</H1>
          <div className="relative rounded-md border-8 border-green-koldup bg-transparent text-center py-5 w-full flex items-center justify-center text-6xl font-semibold">
            {!session?.totalPlungeSecs
              ? '🎉🎉🎉'
              : formatSecsToMins(session.totalPlungeSecs)}
          </div>
        </div>
        <Subtitle className="text-3xl text-zinc-900 font-medium">
          Well done!
        </Subtitle>
        <Subtitle className="text-xl w-[210px]">
          Enjoy feeling great for the rest of the day 🚀
        </Subtitle>
      </div>
      <SessionEndContinueBtn />
    </main>
  );
}
