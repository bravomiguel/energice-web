import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';
import { GoGoal } from 'react-icons/go';
import { BsThermometerSnow } from 'react-icons/bs';
import { GoChecklist } from 'react-icons/go';
import { IoWarningOutline } from 'react-icons/io5';

import {
  checkAuth,
  getLockByLockId,
  getUnitById,
  getUserById,
} from '@/lib/server-utils';
import H1 from '@/components/h1';
import Image from 'next/image';
import BottomNav from '@/components/bottom-nav';
import { createLockCode } from '@/actions/actions';
import UnlockPlungeBtn from '@/components/unlock-plunge-btn';

export default async function Page({ params }: { params: { unitId: string } }) {
  noStore();

  // auth check
  const session = await checkAuth();
  const user = await getUserById(session.user.id);

  // onboarded check
  if (!user?.firstName) redirect('/member-details');
  if (!user.isWaiverSigned) redirect('/waiver');

  // get unit
  const unit = await getUnitById(params.unitId);
  if (!unit) {
    // redirect('/');
    console.error('Unit not found');
    return;
  }

  // get unit lock
  const lock = await getLockByLockId(unit.lockDeviceId);
  const unitStatus = !lock.properties.online
    ? 'Offline'
    : lock.properties.door_open
    ? 'In use'
    : 'Ready';

  // create new lock code
  const response = await createLockCode({
    lockDeviceId: unit.lockDeviceId,
    minsLaterEndTime: 3,
  });
  if (response?.error) {
    console.error({ error: response.error });
  }

  return (
    <main className="relative flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <H1>{unit.hostName}</H1>
        {/* <Subtitle>KoldUp Plunge</Subtitle> */}
        <PlungeStatus unitStatus={unitStatus} />
      </div>
      <PlungeImage imageUrl={unit.imageUrl} />
      <PlungeDetails />
      <PlungeBtnSet unitStatus={unitStatus} unitId={params.unitId} />
    </main>
  );
}

function PlungeStatus({ unitStatus }: { unitStatus: string }) {
  return (
    <div className="flex gap-1.5 ml-0.5 -mt-2 items-center -translate-y-0.5">
      <div className="h-2.5 w-2.5 rounded-full bg-green-300"></div>
      <p className="text-xs text-zinc-500">{unitStatus}</p>
    </div>
  );
}

function PlungeImage({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="w-full h-[25vh] rounded-lg overflow-hidden flex justify-center items-center bg-zinc-200">
      <Image
        src={imageUrl}
        alt="cold plunge image"
        // className="max-w-full max-h-full"
        width={300}
        height={50}
      />
    </div>
  );
}

function PlungeDetails() {
  return (
    <div className="flex-1 flex flex-col gap-0">
      <div className="flex gap-3 items-center py-4 border-b">
        <GoGoal className="h-7 w-7 mr-1 text-zinc-500" />
        <div className="flex gap-2 items-center">
          <p className="text-600">Set your target plunge time:</p>
          <input
            type="time"
            defaultValue="02:00"
            max={'08:00'}
            className="rounded-lg bg-zinc-200 font-bold text-lg px-2"
            // onChange={(e: React.FormEvent<HTMLInputElement>) => {
            //   const [minutes, seconds] = e.currentTarget.value
            //     .split(':')
            //     .map(Number);
            //   // console.log({ totalSeconds: minutes * 60 + seconds });
            //   setTargetPlungeSecs(minutes * 60 + seconds);
            // }}
          />
        </div>
      </div>

      <div className="flex gap-3 items-center py-4 border-b">
        <BsThermometerSnow className="ml-1 h-7 w-7 text-zinc-500" />
        <p className="text-600">42F-46F water temp</p>
      </div>

      <div className="flex gap-3 items-center py-4 border-b">
        <GoChecklist className="ml-1 h-7 w-7 text-zinc-500 self-start" />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-zinc-200 rounded-full text-xs flex items-center justify-center text-zinc-700 font-extrabold">
              1
            </div>
            <p className="text-600">Unlock the plunge to start session</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-zinc-200 rounded-full text-xs flex items-center justify-center text-zinc-700 font-extrabold">
              2
            </div>
            <p className="text-600">Open the lid and plunge in!</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-zinc-200 rounded-full text-xs flex items-center justify-center text-zinc-700 font-extrabold">
              3
            </div>
            <p className="text-600">{`Close the lid when you're done`}</p>
          </div>
        </div>
      </div>

      <div className="w-full h-[25vh] rounded-lg overflow-hidden flex justify-center items-center bg-zinc-200">
        {`GIF "How it works" Explanation`}
      </div>
    </div>
  );
}

function PlungeBtnSet({ unitStatus, unitId }: { unitStatus: string, unitId: string }) {
  return (
    <BottomNav>
      <div className="flex gap-4">
        <div className="flex gap-1 items-center">
          <p className="text-4xl font-bold">$10</p>
        </div>
        <UnlockPlungeBtn disabled={unitStatus !== 'Ready'} unitId={unitId} />
      </div>
      <div className="flex gap-3 items-center pt-2">
        <IoWarningOutline className="ml-1 h-8 w-8 text-red-500 self-start" />
        <p className="text-600 text-red-500 font-semibold w-fit pr-2 text-xs">
          {`Make sure to close the lid when you're done to avoid an extra
    $10 charge`}
        </p>
      </div>
    </BottomNav>
  );
}
