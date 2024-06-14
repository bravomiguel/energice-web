'use client';

import { GoGoal } from 'react-icons/go';
import { BsThermometerSnow } from 'react-icons/bs';
import { GoChecklist } from 'react-icons/go';
import { Button } from './ui/button';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import BottomNav from './bottom-nav';
import PenaltyChargeWarning from './penalty-charge-warning';
import { createActiveSession } from '@/actions/actions';
import { useState } from 'react';

export default function PlungeDetails({
  unitStatus,
  unitId,
}: {
  unitStatus: string;
  unitId: string;
}) {
  const [plungeTimerSecs, setPlungeTimerSecs] = useState(120);
  return (
    <>
      <div className="flex-1 flex flex-col gap-0">
        <div className="flex gap-3 items-center py-4 border-b">
          <GoGoal className="h-7 w-7 mr-1 text-zinc-500" />
          <div className="flex gap-2 w-full">
            <p className="w-full self-center">Set your plunge time:</p>
            <div className="flex justify-between items-start w-full gap-2">
              <input
                type="time"
                defaultValue="02:00"
                max={'08:00'}
                className="rounded-lg bg-zinc-200 font-bold text-lg px-2 w-28 h-8"
                // onChange={(e: React.FormEvent<HTMLInputElement>) => {
                //   const [minutes, seconds] = e.currentTarget.value
                //     .split(':')
                //     .map(Number);
                //   // console.log({ totalSeconds: minutes * 60 + seconds });
                //   setTargetPlungeSecs(minutes * 60 + seconds);
                // }}
              />

              <Button
                size="sm"
                className="p-2 bg-indigo-600 hover:bg-indigo-600/90"
              >
                <IoMdInformationCircleOutline className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 items-center py-4 border-b">
          <BsThermometerSnow className="ml-1 h-7 w-7 text-zinc-500" />
          <p>42F-46F water temp</p>
        </div>

        <div className="flex flex-col gap-3 py-4 border-b">
          <div className="flex gap-3 items-center">
            <GoChecklist className="ml-1 h-7 w-7 text-zinc-500 self-start" />
            <p>How it works</p>
          </div>
          <div className="w-full h-[25vh] rounded-lg overflow-hidden flex justify-center items-center bg-zinc-200">
            {`GIF "How it works" Explanation`}
          </div>
        </div>
      </div>
      <BottomNav>
        <div className="flex gap-4">
          <div className="flex gap-1 items-center">
            <p className="text-4xl font-bold">$10</p>
          </div>
          <Button
            disabled={unitStatus !== "Ready"}
            className="flex-1"
            onClick={async () => {
              const response = await createActiveSession({
                unitId,
                assignCode: true,
              });
              if (response?.error) {
                console.error({ error: response.error });
              }
            }}
          >
            Start Plunge
          </Button>
        </div>
        <PenaltyChargeWarning />
      </BottomNav>
    </>
  );
}
