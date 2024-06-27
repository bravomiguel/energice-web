'use client';

import { Session } from '@prisma/client';

import { cn, formatSecsToMins, getTimeDiffSecs } from '@/lib/utils';
import { IoIosTimer } from 'react-icons/io';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { IoWarningOutline } from 'react-icons/io5';
// import { IoIosThumbsUp } from 'react-icons/io';
import Subtitle from './subtitle';
import BottomNav from './bottom-nav';
import { Button } from './ui/button';
import H1 from './h1';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { endSession } from '@/actions/actions';
import EndSessionBtn from './end-session-btn';
import PlungeTipsDrawer from './plunge-tips-drawer';
import { usePlungeSessions } from '@/contexts/sessions-context-provider';
import Image from 'next/image';
import { toast } from 'sonner';

export default function SessionDisplay({
  sessionId,
  plungeTimerSecs,
  sessionSecs,
  className,
}: {
  sessionId: Session['id'];
  plungeTimerSecs: Session['plungeTimerSecs'];
  sessionSecs: number;
  className?: string;
}) {
  // const { id: sessionId, plungeTimerSecs } = sessionData;
  // const plungeTimerSecs = 10;
  const [countdownSecs, setCountdownSecs] = useState(() => {
    const storedCountdownSecs = localStorage.getItem('countdownSecs');
    return storedCountdownSecs
      ? JSON.parse(storedCountdownSecs)
      : plungeTimerSecs;
  });
  const [totalPlungeSecs, setTotalPlungeSecs] = useState(0);
  const [isTimerPlaying, setIsTimerPlaying] = useState<boolean | null>(null);
  const [sessionSecsLeft, setSessionSecsLeft] = useState(sessionSecs);
  console.log({sessionSecsLeft});
  const [isPending, startTransition] = useTransition();
  const { handleChangeActiveSessionSecs, handleChangeActivePlungeSecs } =
    usePlungeSessions();

  const handleUpdateCountdownSecs = (remainingTime: number) => {
    const storedCountdownSecs = localStorage.getItem('countdownSecs');

    if (!storedCountdownSecs) {
      localStorage.setItem('countdownSecs', JSON.stringify(remainingTime));
    }

    localStorage.setItem('countdownSecs', JSON.stringify(remainingTime));

    setCountdownSecs(remainingTime);
  };

  const handleIsTimerPlaying = () => {
    setIsTimerPlaying((prev) => (prev === null ? true : !prev));
  };

  const handleEndSession = useCallback(async () => {
    startTransition(async () => {
      // clean out local storage
      localStorage.removeItem('countdownSecs');
      localStorage.removeItem('isTimerPlaying');
      // run end session server action
      const response = await endSession({
        sessionId,
        totalPlungeSecs,
      });
      if (response?.error) {
        console.error({ error: response.error });
        toast.error(response.error);
      }
    });
  }, [sessionId, totalPlungeSecs]);

  useEffect(() => {
    if (isTimerPlaying !== null) {
      localStorage.setItem('isTimerPlaying', JSON.stringify(isTimerPlaying));
    }

    setIsTimerPlaying(() => {
      const storedIsTimerPlaying = localStorage.getItem('isTimerPlaying');
      return storedIsTimerPlaying ? JSON.parse(storedIsTimerPlaying) : null;
    });
  }, [isTimerPlaying]);

  useEffect(() => {
    const totalPlungeSecsId = setInterval(() => {
      if (isTimerPlaying) {
        setTotalPlungeSecs((prev) => prev + 1); // need to make this persist in local storage
        handleChangeActivePlungeSecs(totalPlungeSecs);
      } else {
        clearInterval(totalPlungeSecsId);
      }
    }, 1000);

    return () => clearInterval(totalPlungeSecsId);
  }, [isTimerPlaying, handleChangeActivePlungeSecs, totalPlungeSecs]);

  useEffect(() => {
    const sessionTimeId = setInterval(() => {
      if (sessionSecsLeft > -60) {
        setSessionSecsLeft((prev) => prev - 1);
        handleChangeActiveSessionSecs(sessionSecsLeft);
      } else {
        clearInterval(sessionTimeId);
      }
    }, 1000);

    if (sessionSecsLeft === 362) {
      toast.success('Session started');
    }

    if (sessionSecsLeft <= -60) {
      handleEndSession();
    }

    return () => clearInterval(sessionTimeId);
  }, [sessionSecsLeft, handleEndSession, handleChangeActiveSessionSecs]);

  if (sessionSecsLeft > 362) {
    return (
      <div className="flex-1 w-full h-full flex flex-col justify-center items-center gap-6 -translate-y-[10%]">
        <div className="flex flex-col gap-1 items-center text-center">
          <Subtitle className="text-3xl text-zinc-900 font-medium">
            Plunge unlocked
          </Subtitle>
          <Subtitle className="text-xl px-5">
            Open the lid, and take the plunge!
          </Subtitle>
        </div>
        <div className="w-[300px] h-[220px] rounded-lg overflow-hidden flex justify-center items-center bg-gray-200 shadow-md">
          <Image
            src="/koldup_plunge_open.jpeg"
            alt="cold plunge open image"
            width={300}
            height={50}
          />
        </div>
      </div>
    );
  }

  if (sessionSecsLeft <= 0) {
    return (
      <>
        <div className="flex-1 w-full h-full flex flex-col justify-center items-center gap-6 -translate-y-[10%]">
          <Subtitle className="text-3xl text-zinc-900 font-medium flex gap-1">
            {`Close the lid in `}
            <span className="w-24 flex justify-start items-center">
              {formatSecsToMins(60 + sessionSecsLeft)}
            </span>
          </Subtitle>
          <div className="w-[300px] h-[220px] rounded-lg overflow-hidden flex justify-center items-center bg-gray-200 shadow-md">
            <Image
              src="/koldup_plunge.jpeg"
              alt="cold plunge closed image"
              width={300}
              height={50}
            />
          </div>
          <div className="flex gap-3 items-center justify-center w-full px-5 mx-auto">
            <IoWarningOutline className="h-16 w-16 text-red-500" />
            <Subtitle className="text-xl text-red-500 font-semibold w-fit text-start leading-tight">
              {`to avoid an extra`} <br />
              {`session charge`}
            </Subtitle>
          </div>
        </div>
        <BottomNav>
          <Button
            variant="destructive"
            className="w-full h-16"
            disabled={isPending}
            isLoading={isPending}
            onClick={async () => await handleEndSession()}
          >
            Done
          </Button>
        </BottomNav>
      </>
    );
  }

  return (
    <>
      <div className="w-full flex justify-between items-center">
        <H1>Session</H1>
        <PlungeTipsDrawer className="w-10 h-10 bg-green-koldup" />
      </div>
      <div className={cn(className)}>
        <CountdownCircleTimer
          isPlaying={isTimerPlaying || false}
          duration={plungeTimerSecs}
          initialRemainingTime={countdownSecs}
          colors={['#4338ca', '#4338ca']}
          colorsTime={[plungeTimerSecs, 0]}
          rotation="counterclockwise"
          trailColor="#e5e7eb"
          size={300}
          isSmoothColorTransition={false}
          onUpdate={handleUpdateCountdownSecs}
        >
          {({ remainingTime }) => (
            <div className="flex flex-col items-center gap-2">
              <p className="text-zinc-500">Plunge timer</p>
              <span className="text-7xl font-semibold w-52 text-start">
                {formatSecsToMins(remainingTime)}
              </span>
              <div className="flex justify-center items-center gap-1">
                <IoIosTimer className="text-gray-500 h-5 w-5" />
                <p className="text-gray-500 w-12 text-start">
                  {formatSecsToMins(totalPlungeSecs)}
                </p>
              </div>
            </div>
          )}
        </CountdownCircleTimer>

        {/* <div className="ml-12 self-start flex flex-col border-[0.5px] rounded-lg py-2 px-4 shadow">
          <Subtitle className="text-zinc-600 font-normal">
            Session time left
          </Subtitle>
          <p
            className={cn('text-2xl text-zinc-600', {
              'text-amber-500': sessionSecsLeft > 60 && sessionSecsLeft <= 120,
              'text-red-500': sessionSecsLeft <= 60,
            })}
          >
            {sessionSecsLeft >= 10 * 60
              ? '10:00'
              : formatSecsToMins(sessionSecsLeft)}
          </p>
        </div> */}
      </div>
      <BottomNav>
        <Button
          variant={isTimerPlaying === false ? 'koldupBlue' : 'default'}
          className="w-full h-16"
          onClick={handleIsTimerPlaying}
        >
          {isTimerPlaying === null
            ? 'Start timer'
            : !isTimerPlaying
            ? 'Resume timer'
            : 'Pause timer'}
        </Button>
        <EndSessionBtn handleEndSession={handleEndSession} />
      </BottomNav>
    </>
  );
}
