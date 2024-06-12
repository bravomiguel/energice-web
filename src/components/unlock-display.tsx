'use client';

import { cn } from '@/lib/utils';
import CodeExpiryCountdown from './code-expiry-countdown';
import UnlockPlungeBtn from './unlock-plunge-btn';
import Subtitle from './subtitle';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { useEffect, useState } from 'react';
import BottomNav from './bottom-nav';
import { Button } from './ui/button';

export default function UnlockDisplay({
  code,
  secsLeft,
  unitId,
  lockDeviceId,
  className,
}: {
  code: string | null;
  secsLeft: number | null;
  unitId: string;
  lockDeviceId: string;
  className?: string;
}) {
  // const code = 3108;
  // const secsLeft = 5;
  const [countdownSecs, setCountdownSecs] = useState<number | null>(secsLeft);
  const isCodeAvailable = code && countdownSecs && countdownSecs > 0;

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (countdownSecs && countdownSecs > 0) {
        setCountdownSecs(countdownSecs - 1);
      } else {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [countdownSecs]);

  return (
    <>
      <div className={cn(className)}>
        <div className="space-y-3 w-full">
          <Subtitle className="text-zinc-600 flex gap-1 w-full items-center">
            {isCodeAvailable ? (
              'Access code'
            ) : (
              <>
                <IoMdInformationCircleOutline className="w-4 h-4" />
                {countdownSecs === 0
                  ? 'Access code expired'
                  : 'No access code available'}
              </>
            )}
          </Subtitle>
          <div
            className={cn(
              'relative rounded-md border-2 font-medium border-indigo-800 bg-transparent text-center p-5 h-24 w-full flex items-center justify-center',
              { 'border-green-koldup justify-between': !isCodeAvailable },
            )}
          >
            {isCodeAvailable ? (
              <>
                <p className="text-5xl">{code}</p>
                <CodeExpiryCountdown
                  countdownSecs={countdownSecs}
                  setCountdownSecs={setCountdownSecs}
                />
              </>
            ) : (
              <>
                <div className="text-left">
                  <p>Unlock directly via app</p>
                  <p className="text-xs text-zinc-500">
                    NB: may take up to 30 secs
                  </p>
                </div>
                <UnlockPlungeBtn
                  variant="koldupGreen"
                  unitId={unitId}
                  lockDeviceId={lockDeviceId}
                >
                  Unlock
                </UnlockPlungeBtn>
              </>
            )}
          </div>
        </div>
        {isCodeAvailable ? (
          <div className="space-y-3 w-full">
            <Subtitle className="text-zinc-600">Instructions</Subtitle>
            <div className="w-full h-[25vh] rounded-lg overflow-hidden flex justify-center items-center bg-zinc-200">
              {`GIF "How it works" Explanation`}
            </div>
          </div>
        ) : null}
      </div>
      <BottomNav className="space-y-2">
        <Subtitle className="text-zinc-600">Access issues?</Subtitle>
        {isCodeAvailable ? (
          <UnlockPlungeBtn
            className="w-full"
            unitId={unitId}
            lockDeviceId={lockDeviceId}
          >
            Unlock via app
          </UnlockPlungeBtn>
        ) : null}
        <Button variant="outline" className="w-full">
          Report issue
        </Button>
      </BottomNav>
    </>
  );
}
