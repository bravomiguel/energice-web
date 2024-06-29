'use client';

import { Session } from '@prisma/client';

import { cn, formatSecsToMins } from '@/lib/utils';
import { IoIosTimer } from 'react-icons/io';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

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
import { SESSION_MAX_TIME_SECS } from '@/lib/constants';

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
  const [sessionSecsLeft, setSessionSecsLeft] = useState(sessionSecs);
  console.log({ sessionSecsLeft });

  const [countdownSecs, setCountdownSecs] = useState<number | undefined>();
  const [totalPlungeSecs, setTotalPlungeSecs] = useState(0);
  const [isFirstOverTimeSec, setIsFirstOverTimeSec] = useState(true);

  const [isTimerPlaying, setIsTimerPlaying] = useState<boolean | null>(null);

  const [isPending, startTransition] = useTransition();
  const { handleChangeActiveSessionSecs } = usePlungeSessions();

  const handleCountdownUpdate = (remainingTime: number) => {
    localStorage.setItem('countdownSecs', JSON.stringify(remainingTime));
    setCountdownSecs(remainingTime);
    if (remainingTime > 0) {
      setTotalPlungeSecs(plungeTimerSecs - remainingTime);
      localStorage.setItem(
        'totalPlungeSecs',
        JSON.stringify(plungeTimerSecs - remainingTime),
      );
    }
  };

  const handleIsTimerPlaying = () => {
    setIsTimerPlaying((prev) => (prev === null ? true : !prev));
  };

  const handleEndSession = useCallback(async () => {
    setIsTimerPlaying(false);
    startTransition(async () => {
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
    const storedCountdownSecs = localStorage.getItem('countdownSecs');
    if (storedCountdownSecs) {
      setCountdownSecs(JSON.parse(storedCountdownSecs));
    } else {
      setCountdownSecs(plungeTimerSecs);
    }
  }, [plungeTimerSecs]);

  useEffect(() => {
    const storedTotalPlungeSecs = localStorage.getItem('totalPlungeSecs');
    if (storedTotalPlungeSecs) {
      setTotalPlungeSecs(JSON.parse(storedTotalPlungeSecs));
    } else {
      setTotalPlungeSecs(0);
    }
  }, []);

  useEffect(() => {
    if (isTimerPlaying !== null) {
      localStorage.setItem('isTimerPlaying', JSON.stringify(isTimerPlaying));
    }

    const storedIsTimerPlaying = localStorage.getItem('isTimerPlaying');
    if (storedIsTimerPlaying)
      setIsTimerPlaying(JSON.parse(storedIsTimerPlaying));
  }, [isTimerPlaying]);

  useEffect(() => {
    let totalPlungeSecsId: NodeJS.Timeout;
    if (countdownSecs === 0) {
      if (isFirstOverTimeSec) {
        setTotalPlungeSecs(totalPlungeSecs + 1);
        localStorage.setItem(
          'totalPlungeSecs',
          JSON.stringify(totalPlungeSecs + 1),
        );
        setIsFirstOverTimeSec(false);
      }
      totalPlungeSecsId = setInterval(() => {
        if (isTimerPlaying) {
          setTotalPlungeSecs(totalPlungeSecs + 1);
          localStorage.setItem(
            'totalPlungeSecs',
            JSON.stringify(totalPlungeSecs + 1),
          );
        } else {
          clearInterval(totalPlungeSecsId);
        }
      }, 1000);
    }

    return () => clearInterval(totalPlungeSecsId);
  }, [isTimerPlaying, totalPlungeSecs, countdownSecs, isFirstOverTimeSec]);

  useEffect(() => {
    const sessionTimeId = setInterval(() => {
      if (sessionSecsLeft > 0) {
        setSessionSecsLeft(sessionSecsLeft - 1);
        handleChangeActiveSessionSecs(sessionSecsLeft - 1);
      } else {
        clearInterval(sessionTimeId);
        handleChangeActiveSessionSecs(0);
      }
    }, 1000);

    if (sessionSecsLeft === SESSION_MAX_TIME_SECS) {
      toast.success('Session started');
    }

    if (sessionSecsLeft <= 0) {
      handleEndSession();
    }

    return () => clearInterval(sessionTimeId);
  }, [sessionSecsLeft, handleEndSession, handleChangeActiveSessionSecs]);

  if (sessionSecsLeft > SESSION_MAX_TIME_SECS) {
    return (
      <div className="flex-1 w-full h-full flex flex-col justify-center items-center gap-6 -translate-y-[10%]">
        <div className="flex flex-col gap-1 items-center text-center">
          <Subtitle className="text-3xl text-zinc-900 font-medium">
            Plunge unlocked
          </Subtitle>
          <Subtitle className="text-xl px-8">
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
        <Subtitle className="flex gap-1 justify-center items-center translate-x-1">
          <p>{`Session starts in `}</p>
          <span className="w-14 flex justify-start items-center">
            {formatSecsToMins(sessionSecsLeft - SESSION_MAX_TIME_SECS)}
          </span>
        </Subtitle>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex justify-between items-center">
        <H1>Session</H1>
        <PlungeTipsDrawer className="w-10 h-10 bg-green-koldup" />
      </div>
      <div className={cn(className)}>
        {countdownSecs || countdownSecs === 0 ? (
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
            onUpdate={handleCountdownUpdate}
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
        ) : null}
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
