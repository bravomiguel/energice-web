import { unstable_noStore as noStore } from 'next/cache';
import { IoWarningOutline } from 'react-icons/io5';
import { CiCircleInfo } from 'react-icons/ci';
import { IoMdInformationCircleOutline } from 'react-icons/io';

import {
  checkAuth,
  getCodesbyLockId,
  getUnitById,
  getUserById,
} from '@/lib/server-utils';
import { getLatestActiveCode } from '@/actions/actions';
import { Input } from '@/components/ui/input';
import H1 from '@/components/h1';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/bottom-nav';
import Subtitle from '@/components/subtitle';
import { cn } from '@/lib/utils';

export default async function Page({ params }: { params: { unitId: string } }) {
  noStore();

  // auth check
  // await checkAuth();

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
    // logic to create and start session, with 5 second countdown
  }

  return (
    <main className="relative flex-1 flex flex-col gap-10">
      <H1>Access Code</H1>
      <div className="flex-1 flex flex-col gap-10">
        <div className="space-y-3 w-full">
          <Subtitle
            className={cn('text-zinc-600 flex gap-1 w-full items-center', {
              invisible: activeCode,
            })}
          >
            <IoMdInformationCircleOutline className="w-4 h-4" />
            {`No code available`}
          </Subtitle>
          <div
            className={cn(
              'relative rounded-md border-2 font-medium border-indigo-800 bg-transparent text-center p-5 h-24 w-full flex items-center justify-center',
              { 'border-green-koldup': !activeCode },
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
              <div className="flex gap-3">
                <div className="text-left">
                  <p>Unlock directly via app</p>
                  <p className="text-xs text-zinc-500">
                    NB: may take up to 30 secs
                  </p>
                </div>
                <Button variant="koldupGreen">
                  Unlock
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 w-full">
          <Subtitle className="text-zinc-600">Instructions</Subtitle>
          <div className="w-full h-[25vh] rounded-lg overflow-hidden flex justify-center items-center bg-zinc-200">
            {`GIF "How it works" Explanation`}
          </div>
        </div>
      </div>

      <BottomNav className="space-y-2">
        <Subtitle className="text-zinc-600">Access issues?</Subtitle>
        <Button className="w-full">Unlock directly</Button>
        <Button variant="outline" className="w-full">
          Report issue
        </Button>
      </BottomNav>
    </main>
  );
}
