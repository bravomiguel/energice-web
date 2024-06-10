import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';
import { GoGoal } from 'react-icons/go';
import { BsThermometerSnow } from 'react-icons/bs';
import { GoChecklist } from 'react-icons/go';
import { IoWarningOutline } from 'react-icons/io5';

import { checkAuth, getUserById } from '@/lib/server-utils';
import H1 from '@/components/h1';
import Image from 'next/image';
import BottomNav from '@/components/bottom-nav';
import { Button } from '@/components/ui/button';

export default async function Page({ params }: { params: { unitId: string } }) {
  noStore();

  const session = await checkAuth();
  const user = await getUserById(session.user.id);

  if (!user?.firstName) redirect('/member-details');
  if (!user.isWaiverSigned) redirect('/waiver');

  return (
    <main className="relative flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {/* <H1>Texas Iron Gym</H1> */}
        <H1>{params.unitId}</H1>
        {/* <Subtitle>KoldUp Plunge</Subtitle> */}
        <PlungeStatus />
      </div>
      <PlungeImage />
      <PlungeDetails />
      <PlungeBtnSet />
    </main>
  );
}

function PlungeStatus() {
  return (
    <div className="flex gap-1.5 ml-0.5 -mt-2 items-center -translate-y-0.5">
      <div className="h-2.5 w-2.5 rounded-full bg-green-300"></div>
      <p className="text-xs text-gray-500">Ready</p>
    </div>
  );
}

function PlungeImage() {
  return (
    <div className="w-full h-[25vh] rounded-lg overflow-hidden flex justify-center items-center bg-gray-200">
      <Image
        src="/koldup_plunge.jpeg"
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
        <GoGoal className="h-7 w-7 mr-1 text-gray-500" />
        <div className="flex gap-2 items-center">
          <p className="text-600">Set your target plunge time:</p>
          <input
            type="time"
            defaultValue="02:00"
            max={'08:00'}
            className="rounded-lg bg-gray-200 font-bold text-lg px-2"
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
        <BsThermometerSnow className="ml-1 h-7 w-7 text-gray-500" />
        <p className="text-600">42F-46F water temp</p>
      </div>

      <div className="flex gap-3 items-center py-4 border-b">
        <GoChecklist className="ml-1 h-7 w-7 text-gray-500 self-start" />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-gray-200 rounded-full text-xs flex items-center justify-center text-gray-700 font-extrabold">
              1
            </div>
            <p className="text-600">Unlock the plunge to start session</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-gray-200 rounded-full text-xs flex items-center justify-center text-gray-700 font-extrabold">
              2
            </div>
            <p className="text-600">Open the lid and plunge in!</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-gray-200 rounded-full text-xs flex items-center justify-center text-gray-700 font-extrabold">
              3
            </div>
            <p className="text-600">{`Close the lid when you're done`}</p>
          </div>
        </div>
      </div>

      <div className="w-full h-[25vh] rounded-lg overflow-hidden flex justify-center items-center bg-gray-200">
        {`GIF "How it works" Explanation`}
      </div>
    </div>
  );
}

function PlungeBtnSet() {
  return (
    <BottomNav>
      <div className="flex gap-4">
        <div className="flex gap-1 items-center">
          <p className="text-4xl font-bold">$10</p>
        </div>
        <Button
          className="flex-1"
          // onClick={() => router.push('/app/session')}
        >
          Unlock Plunge
        </Button>
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
