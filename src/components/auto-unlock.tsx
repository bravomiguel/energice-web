'use client';

import { useCallback, useLayoutEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { IoIosArrowBack, IoMdInformationCircleOutline } from 'react-icons/io';
import { PiArrowClockwiseBold } from 'react-icons/pi';
import { toast } from 'sonner';
import { Session, Unit } from '@prisma/client';

import { startSession } from '@/lib/actions/session-actions';
import { unlockAction } from '@/lib/actions/unit-actions';
import LoadingSpinner from './loaders/loading-spinner';
import { cn } from '@/lib/utils';
import BottomNav from './bottom-nav';
import Subtitle from './subtitle';
import { Button } from './ui/button';
import H1 from './h1';

export default function AutoUnlock({
  unitId,
  sessionId,
  className,
}: {
  unitId: Unit['id'];
  sessionId: Session['id'];
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [isError, setIsError] = useState<boolean>(false);

  const handleUnlock = useCallback(async () => {
    startTransition(async () => {
      const unlockResponse = await unlockAction({ unitId });
      if (unlockResponse?.error) {
        setIsError(true);
        console.error({ error: unlockResponse.error });
        toast.error(unlockResponse.error);
        return;
      }
      const startSessionResp = await startSession({ sessionId });
      if (startSessionResp?.error) {
        setIsError(true);
        console.error({ error: startSessionResp.error });
        toast.error(startSessionResp.error);
        return;
      }
    });
  }, [unitId, sessionId]);

  useLayoutEffect(() => {
    // clean out local storage
    localStorage.clear();
    handleUnlock();
  }, [handleUnlock]);

  if (isPending) {
    return (
      <div className={cn(className)}>
        <LoadingSpinner
          className="flex-1 flex flex-col items-center justify-center text-sm w-44 mx-auto gap-2 text-zinc-500 text-center"
          size={30}
          color="text-indigo-700"
          messages={[
            'Unlocking plunge...',
            'May take a few secs to complete...',
            'You can start as soon as you hear the lid open...',
            'Can take a few secs to register the unlock...',
          ]}
        />
      </div>
    );
  }

  if (!isPending && isError) {
    return (
      <>
        <Link
          href={'/'}
          className="w-full flex gap-0.5 text-indigo-800 items-center text-xs"
        >
          <IoIosArrowBack className="h-7 w-7 text-indigo-700 -translate-x-2" />
          <p className="-translate-x-3">Home</p>
        </Link>
        <div className={cn(className)}>
          <H1>Unlock Plunge</H1>
          <UnlockRetry handleUnlock={handleUnlock} isPending={isPending} />
        </div>
        <BottomNav className="gap-2">
          <Subtitle className="text-zinc-600 text-start">
            Access issues?
          </Subtitle>
          <Link href="https://energicelife.com/#help-and-support" className="w-full">
            <Button variant="outline" className="w-full">
              Report issue
            </Button>
          </Link>
        </BottomNav>
      </>
    );
  }

  return null;
}

function UnlockRetry({
  handleUnlock,
  isPending,
}: {
  handleUnlock: () => Promise<void>;
  isPending: boolean;
}) {
  return (
    <div className="flex-1 flex flex-col items-center gap-3">
      <Subtitle className="text-zinc-600 flex gap-1 w-full items-center">
        <IoMdInformationCircleOutline className="w-4 h-4" />
        Unlock unsuccessful
      </Subtitle>
      <Button
        className="w-full h-16 flex gap-3"
        variant="koldupGreen"
        onClick={async () => await handleUnlock()}
        disabled={isPending}
        isLoading={isPending}
        loadingBgColor="fill-green-koldup"
      >
        <PiArrowClockwiseBold className="w-5 h-5" />
        <p>Try again</p>
      </Button>
    </div>
  );
}
