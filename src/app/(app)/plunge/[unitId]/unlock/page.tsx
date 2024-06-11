import { unstable_noStore as noStore } from 'next/cache';
import { IoMdInformationCircleOutline } from 'react-icons/io';

import { getUnitById } from '@/lib/server-utils';
import { getLatestActiveCode } from '@/actions/actions';
import H1 from '@/components/h1';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/bottom-nav';
import Subtitle from '@/components/subtitle';
import { cn } from '@/lib/utils';
import { Unit } from '@prisma/client';
import UnlockPlungeBtn from '@/components/unlock-plunge-btn';

export default async function Page({
  params,
}: {
  params: { unitId: Unit['id'] };
}) {
  noStore();

  // get unit
  const unit = await getUnitById(params.unitId);
  if (!unit) {
    // redirect('/');
    console.error('Unit not found');
    return;
  }

  // get newest active code
  const response = await getLatestActiveCode({
    lockDeviceId: unit.lockDeviceId,
  });
  console.log({ response });
  if (response.error) {
    console.error(response.error);
  }

  const activeCode = response?.data ?? null;

  if (activeCode) {
    // 1) Fire "create session" server action which
    // a) creates new session in db, for specific user and unit
    // b) marks new session flag as active
    // c) returns new session id
  }

  // 2) if there is no session id, or error, return error message / screen

  // 3) feed session id into "session starting" client component which starts 10s countdown, and then
  // 4) when countdown ends, client component fires "navigate to session" server action which
  // a) sets session end time in db, to 10m2s in future, and
  // b) navigates to dynamic session screen using session id

  return (
    <main className="flex-1 flex flex-col gap-10">
      <H1>Unlock Plunge</H1>
      <div className="flex-1 flex flex-col gap-10">
        <div className="space-y-3 w-full">
          <Subtitle className="text-zinc-600 flex gap-1 w-full items-center">
            {activeCode ? (
              'Access code'
            ) : (
              <>
                <IoMdInformationCircleOutline className="w-4 h-4" />
                {`No code available`}
              </>
            )}
          </Subtitle>
          <div
            className={cn(
              'relative rounded-md border-2 font-medium border-indigo-800 bg-transparent text-center p-5 h-24 w-full flex items-center justify-center',
              { 'border-green-koldup justify-between': !activeCode },
            )}
          >
            {activeCode ? (
              <>
                <p className="text-5xl">3108</p>
                <p className="absolute bottom-0 right-0 text-end text-xs px-2 py-1 text-zinc-500">
                  Expires in 1:34
                </p>
              </>
            ) : (
              <>
                <div className="text-left">
                  <p>Unlock directly via app</p>
                  <p className="text-xs text-zinc-500">
                    NB: may take up to 30 secs
                  </p>
                </div>
                {/* <Button variant="koldupGreen">Unlock</Button> */}
                <UnlockPlungeBtn
                  variant="koldupGreen"
                  unitId={unit.id}
                  lockDeviceId={unit.lockDeviceId}
                >
                  Unlock
                </UnlockPlungeBtn>
              </>
            )}
          </div>
        </div>

        {activeCode && (
          <div className="space-y-3 w-full">
            <Subtitle className="text-zinc-600">Instructions</Subtitle>
            <div className="w-full h-[25vh] rounded-lg overflow-hidden flex justify-center items-center bg-zinc-200">
              {`GIF "How it works" Explanation`}
            </div>
          </div>
        )}
      </div>

      <BottomNav className="space-y-2">
        <Subtitle className="text-zinc-600">Access issues?</Subtitle>
        {/* <Button className="w-full">Unlock via app</Button> */}
        <UnlockPlungeBtn
          className="w-full"
          unitId={unit.id}
          lockDeviceId={unit.lockDeviceId}
        >
          Unlock via app
        </UnlockPlungeBtn>
        <Button variant="outline" className="w-full">
          Report issue
        </Button>
      </BottomNav>
    </main>
  );
}
