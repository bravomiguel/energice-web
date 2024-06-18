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
import { useCallback, useEffect, useState } from 'react';
import { endSession } from '@/actions/actions';

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
  const [timerCountdownSecs, setTimerCountdownSecs] = useState(() => {
    const storedTimerCountdownSecs = localStorage.getItem('timerCountdownSecs');
    return storedTimerCountdownSecs
      ? JSON.parse(storedTimerCountdownSecs)
      : plungeTimerSecs;
  });
  const [totalPlungeSecs, setTotalPlungeSecs] = useState(0);
  const [isTimerPlaying, setIsTimerPlaying] = useState<boolean | null>(null);
  const [sessionSecsLeft, setSessionSecsLeft] = useState(sessionSecs);

  const handleIsTimerPlaying = () => {
    setIsTimerPlaying((prev) => (prev === null ? true : !prev));
  };

  const handleEndSession = useCallback(async () => {
    // launch full screen loading state
    // TBC
    // clean out local storage
    localStorage.removeItem('timerCountdownSecs');
    localStorage.removeItem('isTimerPlaying');
    // run end session server action
    const response = await endSession({
      sessionId,
      totalPlungeSecs,
    });
    if (response?.error) {
      console.error({ error: response.error });
    }
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
        if (timerCountdownSecs >= 0) {
          setTotalPlungeSecs(plungeTimerSecs - timerCountdownSecs);
        } else {
          setTotalPlungeSecs(totalPlungeSecs + 1);
        }
      } else {
        clearInterval(totalPlungeSecsId);
      }
    }, 1000);

    return () => clearInterval(totalPlungeSecsId);
  }, [isTimerPlaying, plungeTimerSecs, timerCountdownSecs, totalPlungeSecs]);

  useEffect(() => {
    const sessionTimeId = setInterval(() => {
      if (sessionSecsLeft > -30) {
        setSessionSecsLeft(sessionSecsLeft - 1);
      } else {
        clearInterval(sessionTimeId);
      }
    }, 1000);

    if (sessionSecsLeft <= -30) {
      setSessionSecsLeft(-30);
      handleEndSession();
    }

    return () => clearInterval(sessionTimeId);
  }, [sessionSecsLeft, handleEndSession]);

  if (sessionSecsLeft < 0) {
    return (
      <>
        <div className="flex-1 flex flex-col justify-center items-center gap-4">
          <IoWarningOutline className="h-16 w-16 text-red-600" />
          <div className="text-2xl text-red-600 flex gap-2">
            <p className="font-medium">Close the lid in</p>{' '}
            <span className="w-20 font-medium text-start">
              {formatSecsToMins(30 + sessionSecsLeft)}
            </span>
          </div>
          <Subtitle className="text-zinc-800">
            To avoid an extra <span>$10</span> charge
          </Subtitle>
        </div>
        <BottomNav className="space-y-3">
          <Button
            variant="destructive"
            className="w-full h-16"
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
      <H1>Session</H1>
      <div className={cn(className)}>
        <CountdownCircleTimer
          isPlaying={isTimerPlaying || false}
          duration={plungeTimerSecs}
          initialRemainingTime={timerCountdownSecs}
          colors={['#4338ca', '#4338ca']}
          colorsTime={[plungeTimerSecs, 0]}
          rotation="counterclockwise"
          trailColor="#e5e7eb"
          size={300}
          isSmoothColorTransition={false}
          onUpdate={(remainingTime) => {
            const storedTimerCountdownSecs =
              localStorage.getItem('timerCountdownSecs');

            if (!storedTimerCountdownSecs) {
              localStorage.setItem(
                'timerCountdownSecs',
                JSON.stringify(remainingTime),
              );
            }

            localStorage.setItem(
              'timerCountdownSecs',
              JSON.stringify(remainingTime),
            );

            setTimerCountdownSecs(remainingTime);
          }}
        >
          {({ remainingTime }) => (
            <div className="flex flex-col items-center gap-2">
              <p className="text-zinc-500">Plunge timer</p>
              {timerCountdownSecs ? (
                <span className="text-7xl font-semibold w-52 text-start">
                  {formatSecsToMins(remainingTime)}
                </span>
              ) : (
                <span className="text-7xl font-semibold w-52 text-start invisible">
                  Placeholder
                </span>
              )}

              <div
                className={cn(
                  'flex justify-center items-center gap-1 invisible',
                  { visible: timerCountdownSecs && timerCountdownSecs <= 0 },
                )}
              >
                <IoIosTimer className="text-gray-500 h-5 w-5" />
                <p className="text-gray-500 w-12 text-start">
                  {formatSecsToMins(totalPlungeSecs)}
                </p>
              </div>
            </div>
          )}
        </CountdownCircleTimer>
        <div className="ml-12 self-start flex flex-col border-[0.5px] rounded-lg py-2 px-4 shadow">
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
        </div>
      </div>
      <BottomNav className="space-y-3">
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
        <Button
          variant="destructive"
          className="w-full h-16"
          onClick={async () => await handleEndSession()}
        >
          End session
        </Button>
      </BottomNav>
    </>
  );
}
