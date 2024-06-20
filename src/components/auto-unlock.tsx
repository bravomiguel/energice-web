'use client';

import { startSession, unlockAction } from '@/actions/actions';
import { Session, Unit } from '@prisma/client';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  useTransition,
} from 'react';
import LoadingSpinner from './loading-spinner';
import { cn } from '@/lib/utils';
import BottomNav from './bottom-nav';
import Subtitle from './subtitle';
import { Button } from './ui/button';
import { IoMdInformationCircleOutline } from 'react-icons/io';
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
  const [isError, setIsError] = useState<string | null>(null);

  const handleUnlock = useCallback(async () => {
    startTransition(async () => {
      const unlockResponse = await unlockAction({ unitId });
      if (unlockResponse?.error) {
        setIsError(unlockResponse.error);
        console.error({ error: unlockResponse.error });
        return;
      }

      const startSessionResp = await startSession({ sessionId });
      if (startSessionResp?.error) {
        setIsError(startSessionResp.error);
        console.error({ error: startSessionResp.error });
        return;
      }

      setIsError(null);
    });
  }, [unitId, sessionId]);

  useLayoutEffect(() => {
    handleUnlock();
  }, [handleUnlock]);

  if (isPending) {
    return (
      <div className={cn(className)}>
        <LoadingSpinner
          className="flex-1 flex flex-col items-center justify-center text-sm w-44 mx-auto gap-2 text-zinc-500 text-center"
          size={35}
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
    <>
      <div className={cn(className)}>
        <H1>Unlock Plunge</H1>
        <UnlockRetry handleUnlock={handleUnlock} />
      </div>
      <BottomNav className="gap-2">
        <Subtitle className="text-zinc-600 text-start">Access issues?</Subtitle>
        <Button variant="outline" className="w-full" onClick={() => {}}>
          Report issue
        </Button>
      </BottomNav>
    </>;
  }

  return null;
}

function UnlockRetry({ handleUnlock }: { handleUnlock: () => Promise<void> }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-3">
      <Subtitle className="text-zinc-600 flex gap-1 w-full items-center">
        <IoMdInformationCircleOutline className="w-4 h-4" />
        {`Unlock unsuccessful, please try again`}
      </Subtitle>
      <div className="relative rounded-md border-2 font-medium border-green-koldup bg-transparent text-center p-5 h-24 w-full flex items-center justify-between">
        <div className="text-left">
          <p>Unlock directly via app</p>
          <p className="text-xs text-zinc-500">NB: may take up to 30 secs</p>
        </div>
        <Button
          variant="koldupGreen"
          onClick={async () => {
            // console.log('hello')
            await handleUnlock();
          }}
        >
          Unlock
        </Button>
      </div>
    </div>
  );
}
