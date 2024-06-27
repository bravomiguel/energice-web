'use client';

import { cn } from '@/lib/utils';
import CodeExpiryCountdown from './code-expiry-countdown';
import UnlockPlungeBtn from './unlock-plunge-btn';
import Subtitle from './subtitle';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { useEffect, useState, useTransition } from 'react';
import BottomNav from './bottom-nav';
import { Button } from './ui/button';
import { usePlungeSessions } from '@/contexts/sessions-context-provider';
import LoadingSpinner from './loading-spinner';
import { Session } from '@prisma/client';
import Link from 'next/link';

export default function UnlockDisplay({
  code,
  activeSessionId,
  secsLeft,
  unitId,
  className,
}: {
  code: Session['accessCode'];
  activeSessionId: Session['id'];
  secsLeft: number | null;
  unitId: Session['unitId'];
  className?: string;
}) {
  // const code = 3108;
  // const secsLeft = 5;
  const [codeExpirySecs, setCodeExpirySecs] = useState<number | null>(secsLeft);
  const isCodeAvailable = code && codeExpirySecs && codeExpirySecs > 0;

  const { handleChangeActiveSessionId } = usePlungeSessions();
  useEffect(() => {
    if (activeSessionId) handleChangeActiveSessionId(activeSessionId);
  }, [activeSessionId, handleChangeActiveSessionId]);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (codeExpirySecs && codeExpirySecs > 0) {
        setCodeExpirySecs(codeExpirySecs - 1);
      } else {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [codeExpirySecs]);

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
                {codeExpirySecs === 0
                  ? 'Access code expired'
                  : 'No access code available'}
              </>
            )}
          </Subtitle>
          <div
            className={cn(
              'relative rounded-md border-4 font-medium border-indigo-800 bg-transparent text-center p-5 h-24 w-full flex items-center justify-center',
              {
                'border-green-koldup justify-between border-2':
                  !isCodeAvailable,
              },
            )}
          >
            {isCodeAvailable ? (
              <>
                <p className="text-5xl">{code}</p>
                <CodeExpiryCountdown
                  countdownSecs={codeExpirySecs}
                  setCountdownSecs={setCodeExpirySecs}
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
                  sessionId={activeSessionId}
                  isPending={isPending}
                  startTransition={startTransition}
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
        ) : isPending ? (
          <LoadingSpinner
            className="flex-1 flex flex-col items-center justify-center text-sm w-44 mx-auto gap-2 text-zinc-500 text-center"
            size={40}
            color="text-indigo-700"
            messages={[
              'Unlocking plunge...',
              'May take a few secs to complete...',
              'You can start as soon as you hear the lid open...',
              'Can take a few secs to register the unlock...',
            ]}
          />
        ) : null}
      </div>
      <BottomNav>
        <Subtitle className="text-zinc-600 text-start">Access issues?</Subtitle>
        {isCodeAvailable ? (
          <UnlockPlungeBtn
            unitId={unitId}
            sessionId={activeSessionId}
            isPending={isPending}
            startTransition={startTransition}
          >
            Unlock via app
          </UnlockPlungeBtn>
        ) : null}
        <Link href="https://koldup.com/#help-and-support" className="w-full">
          <Button className="w-full" variant="outline">
            Report issue
          </Button>
        </Link>
      </BottomNav>
    </>
  );
}
